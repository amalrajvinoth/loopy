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
//   POST /f/<id>?del=1      body { k: write key }: delete the family's copy. 200 or 404
//
// Both are "simple" requests (GET, or POST with text/plain), so browsers send no extra preflight request.
// Old copies (not written for 400 days) are deleted once a day by the scheduled job in wrangler.toml.

const ID = /^[0-9a-f]{32}$/;
const KEY = /^[A-Za-z0-9_-]{43}$/;
const HASH = /^[0-9a-f]{32}$/;
const MAX_BODY = 80000;       // the request: a locked copy is at most about 60 KB
const MIN_GAP = 10 * 1000;    // one save per family every 10 seconds at most
const KEEP_DAYS = 400;

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

  // Once a day: delete copies nobody has written for KEEP_DAYS days.
  async scheduled(event, env) {
    await env.DB.prepare("DELETE FROM families WHERE t < ?").bind(Date.now() - KEEP_DAYS * 86400000).run();
  }
};
