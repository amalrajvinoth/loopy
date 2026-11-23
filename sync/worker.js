// loopy Family sync server: a Cloudflare Worker that keeps one locked copy per family in a D1 database.
//
// The copy is locked (AES-GCM) on the family's devices with their family code before it is sent.
// This server never sees the code, names, stars or answers: only a random family id, a locked
// blob of text, its hash and the time. See sync/README.md.
//
//   GET  /f/<id>?e=<hash>   the copy: 200 { e, b }, 204 when the copy's hash is still <hash>, 404 when none
//   POST /f/<id>?e=<hash>   body { k: write key, b: locked copy }: save it, if the copy here still has
//                           hash <hash> (leave e out for a new family). 200 { e }, 412 { e } when the copy
//                           changed since (read it, merge, try again), 403 wrong key, 429 too soon
//   POST /f/<id>?del=1      body { k: write key }: delete the family's copy. 200 or 404. An email linked to
//                           this family (below) loses its link
//   GET  /stats             the last 90 nightly rows of counts (families, active in 7 and 30 days, size).
//                           Counts only: no ids, no names, no emails
//   POST /g                 body { m: email, l: language, k: remove key, f: family id (only when the grown-up
//                           ticked "Also link my email to our Family sync") }: "Stay in touch", a grown-up's
//                           email, kept in the GROWNUPS database (EU). 200 {}, 400 not an email, 429 too soon.
//                           An email already saved keeps its first remove key: a later save with another
//                           key changes nothing (and still answers 200, so nobody can tell who is on the list)
//   POST /g?del=1           body { m: email, k: remove key }: delete it. 200 deleted, 404 when there is no
//                           row with this email and this key (unknown, or saved first from another device)
//
// All are "simple" requests (GET, or POST with text/plain), so browsers send no extra preflight request.
// Too many requests from one address answer 429: 60 a minute for the copies and /stats, 6 a minute for /g
// (wrangler.toml, [[ratelimits]]). A family's devices on one Wi-Fi make a few a minute. A flood from one
// address then reaches neither database: no reads or writes of the copies (D1's daily allowance), no junk
// rows in the Stay in touch list. The check runs inside this Worker, so each 429 still counts as one of the
// free plan's 100,000 requests a day; keeping a flood off that allowance needs a rule in front of the Worker
// (a zone rate-limit rule, once loopy has its own domain). Nothing is lost: a device that gets 429 for a
// family copy keeps everything in its own browser and tries again later.
// Once a day the scheduled job (wrangler.toml) deletes old copies (not written for 400 days) and old
// emails (saved 2 years ago), and writes one row of counts into the stats table.

const ID = /^[0-9a-f]{32}$/;
const KEY = /^[A-Za-z0-9_-]{43}$/;
const HASH = /^[0-9a-f]{32}$/;
const MAX_BODY = 80000;       // the request: a locked copy is at most about 60 KB
const MIN_GAP = 10 * 1000;    // one save per family (or email) every 10 seconds at most
const KEEP_DAYS = 400;
const KEEP_MAIL_DAYS = 730;   // an email is deleted 2 years after it was saved (the privacy note says so)
const MAX_MAIL = 254;
const MAX_GROWNUPS = 50000;   // more emails than loopy will ever get; stops a flood
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STATS_DAYS = 90;

// Too many requests from one address? limiter is one of the Rate Limiting bindings in wrangler.toml, counted
// per caller address. It keeps a flood away from the databases and the mailing list; it does not spare the
// Worker's own daily request allowance, because it runs inside the Worker (see the top of this file). Without
// the binding (sync/test.mjs, wrangler dev --local) nothing is limited, and if the binding itself fails the
// request goes through: the limit is a brake, never a reason to lose a save.
async function tooMany(limiter, req) {
  const ip = req.headers.get("CF-Connecting-IP");
  if (!limiter || !ip) return false;
  try { return !(await limiter.limit({ key: ip })).success; } catch (e) { return false; }
}

async function sha(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

function lockedOk(b) {
  if (typeof b !== "string" || b.length > 70000) return false;
  try {
    const j = JSON.parse(b);
    return j && j.v === 1 && typeof j.iv === "string" && /^[A-Za-z0-9+/]{16}$/.test(j.iv)
      && typeof j.d === "string" && /^[A-Za-z0-9+/]+=*$/.test(j.d);
  } catch (e) { return false; }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin") || "";
    const allowed = String(env.ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
    const head = { "Vary": "Origin", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    if (allowed.includes(origin)) head["Access-Control-Allow-Origin"] = origin;
    const send = (status, body) => new Response(body === undefined ? null : JSON.stringify(body),
      { status, headers: body === undefined ? head : { ...head, "Content-Type": "application/json" } });

    if (await tooMany(url.pathname === "/g" ? env.LIMIT_MAIL : env.LIMIT, req)) return send(429);

    if (url.pathname === "/stats") {
      if (req.method !== "GET") return send(405);
      const r = await env.DB.prepare("SELECT day, families, active7, active30, bytes FROM stats ORDER BY day DESC LIMIT ?").bind(STATS_DAYS).all();
      return send(200, r.results || []);
    }
    if (url.pathname === "/g") return grownup(req, url, env, send);

    const m = /^\/f\/([^/]+)$/.exec(url.pathname);
    if (!m || !ID.test(m[1])) return send(404);
    const id = m[1];
    const db = env.DB;

    if (req.method === "GET") {
      const row = await db.prepare("SELECT e, b FROM families WHERE id = ?").bind(id).first();
      if (!row) return send(404);
      if (url.searchParams.get("e") === row.e) return send(204);
      return send(200, { e: row.e, b: row.b });
    }
    if (req.method !== "POST") return send(405);

    const len = Number(req.headers.get("Content-Length") || 0);
    if (len > MAX_BODY) return send(413);
    const text = await req.text();
    if (text.length > MAX_BODY) return send(413);
    let body;
    try { body = JSON.parse(text); } catch (e) { return send(400); }
    if (!body || typeof body.k !== "string" || !KEY.test(body.k)) return send(400);
    const k = await sha("loopy-key:" + body.k);
    const row = await db.prepare("SELECT e, k, t FROM families WHERE id = ?").bind(id).first();
    if (row && row.k !== k) return send(403);

    if (url.searchParams.get("del") === "1") {
      if (!row) return send(404);
      await db.prepare("DELETE FROM families WHERE id = ? AND k = ?").bind(id, k).run();
      // An email linked to this family (Stay in touch) points at nothing now: drop the link, keep the email.
      if (env.GROWNUPS) await env.GROWNUPS.prepare("UPDATE grownups SET f = NULL WHERE f = ?").bind(id).run();
      return send(200, {});
    }

    if (!lockedOk(body.b)) return send(400);
    const want = url.searchParams.get("e") || "";
    if (want && !HASH.test(want)) return send(400);
    const now = Date.now();
    const e = await sha(body.b);
    if (row) {
      if (want !== row.e) return send(412, { e: row.e });
      if (row.e === e) return send(200, { e });
      if (now - row.t < MIN_GAP) return send(429);
      // Only if nobody else saved in between: the hash must still be the one this device read.
      const r = await db.prepare("UPDATE families SET e = ?, b = ?, t = ? WHERE id = ? AND e = ?").bind(e, body.b, now, id, row.e).run();
      if (!r.meta || r.meta.changes !== 1) {
        const cur = await db.prepare("SELECT e FROM families WHERE id = ?").bind(id).first();
        return send(412, { e: cur ? cur.e : "" });
      }
      return send(200, { e });
    }
    if (want) return send(412, { e: "" });
    const r = await db.prepare("INSERT INTO families (id, k, e, b, t) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING")
      .bind(id, k, e, body.b, now).run();
    if (!r.meta || r.meta.changes !== 1) return send(412, { e: "" });
    return send(200, { e });
  },

  // Once a day: delete copies nobody has written for KEEP_DAYS days and emails saved KEEP_MAIL_DAYS ago,
  // then write today's row of counts (replacing it if the job ran twice).
  async scheduled(event, env) {
    const now = Date.now();
    await env.DB.prepare("DELETE FROM families WHERE t < ?").bind(now - KEEP_DAYS * 86400000).run();
    if (env.GROWNUPS) await env.GROWNUPS.prepare("DELETE FROM grownups WHERE t < ?").bind(now - KEEP_MAIL_DAYS * 86400000).run();
    const c = await env.DB.prepare("SELECT COUNT(*) AS f, COALESCE(SUM(t > ?), 0) AS a7, COALESCE(SUM(t > ?), 0) AS a30, COALESCE(SUM(length(b)), 0) AS bytes FROM families")
      .bind(now - 7 * 86400000, now - 30 * 86400000).first();
    await env.DB.prepare("INSERT INTO stats (day, families, active7, active30, bytes) VALUES (?, ?, ?, ?, ?) ON CONFLICT(day) DO UPDATE SET families = excluded.families, active7 = excluded.active7, active30 = excluded.active30, bytes = excluded.bytes")
      .bind(new Date(now).toISOString().slice(0, 10), c ? c.f : 0, c ? c.a7 : 0, c ? c.a30 : 0, c ? c.bytes : 0).run();
  }
};

// "Stay in touch": a grown-up's email, saved from ⚙ Settings on the home page. One row per email, in its own
// database (GROWNUPS, in the EU). The device keeps a random remove key; the server keeps only its hash, so
// only that device (or the owner) can delete the row. The key never changes once saved, so nobody can take
// a row over by posting the same email, and the answers are the same whether an email is on the list or
// not. Nothing else is stored, no IP and no name. The one thing a grown-up can add is their family id (f),
// when they tick "Also link my email to our Family sync": then the owner can see which family copy goes with
// which email. The copy stays locked, so that still tells nothing about stars or names. A save without f
// (the box not ticked) removes an earlier link, and deleting the family copy removes it too.
async function grownup(req, url, env, send) {
  if (req.method !== "POST") return send(405);
  const db = env.GROWNUPS;
  if (!db) return send(503);
  const len = Number(req.headers.get("Content-Length") || 0);
  if (len > 2000) return send(413);
  const text = await req.text();
  if (text.length > 2000) return send(413);
  let body;
  try { body = JSON.parse(text); } catch (e) { return send(400); }
  if (!body || typeof body.m !== "string" || typeof body.k !== "string" || !KEY.test(body.k)) return send(400);
  if (body.f !== undefined && (typeof body.f !== "string" || !ID.test(body.f))) return send(400);
  const f = body.f || null;
  const m = body.m.trim().toLowerCase();
  if (m.length > MAX_MAIL || !EMAIL.test(m)) return send(400);
  const k = await sha("loopy-mail:" + body.k);
  const row = await db.prepare("SELECT k, t FROM grownups WHERE m = ?").bind(m).first();

  if (url.searchParams.get("del") === "1") {
    if (!row || row.k !== k) return send(404);
    await db.prepare("DELETE FROM grownups WHERE m = ? AND k = ?").bind(m, k).run();
    return send(200, {});
  }

  const l = body.l === "de" ? "de" : "en";
  const now = Date.now();
  if (row) {
    if (row.k !== k) return send(200, {});
    if (now - row.t < MIN_GAP) return send(429);
    await db.prepare("UPDATE grownups SET l = ?, t = ?, f = ? WHERE m = ? AND k = ?").bind(l, now, f, m, k).run();
    return send(200, {});
  }
  const n = await db.prepare("SELECT COUNT(*) AS n FROM grownups").first();
  if (n && n.n >= MAX_GROWNUPS) return send(503);
  await db.prepare("INSERT INTO grownups (m, k, l, t, f) VALUES (?, ?, ?, ?, ?) ON CONFLICT(m) DO NOTHING").bind(m, k, l, now, f).run();
  return send(200, {});
}
