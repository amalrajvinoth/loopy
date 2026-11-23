// Tests for the Family sync server (sync/worker.js), with a stand-in database. Run: node sync/test.mjs
import worker from "./worker.js";
import { fakeD1 } from "./fake-d1.mjs";

const db = fakeD1();
const env = { DB: db, GROWNUPS: db, ORIGINS: "https://amalrajvinoth.github.io" };
const ORIGIN = "https://amalrajvinoth.github.io";
const ID = "0123456789abcdef0123456789abcdef", KEY = "A".repeat(43), OTHER = "B".repeat(43);
const copy = n => JSON.stringify({ v: 1, iv: "AAAAAAAAAAAAAAAA", d: btoa("locked " + n) });
let fails = 0;
const ok = (cond, what) => { if (!cond) { fails++; console.log("FAIL: " + what); } else console.log("ok   " + what); };
const call = async (method, path, body, origin = ORIGIN) => {
  const r = await worker.fetch(new Request("https://sync.test" + path, { method, body: body === undefined ? undefined : JSON.stringify(body),
    headers: { Origin: origin, "Content-Type": "text/plain" } }), env);
  const text = await r.text();
  return { n: r.status, j: text ? JSON.parse(text) : null, h: r.headers };
};
const wait = ms => new Promise(r => setTimeout(r, ms));

let r = await call("GET", `/f/${ID}?e=`);
ok(r.n === 404, "no copy yet: 404");
ok(r.h.get("Access-Control-Allow-Origin") === ORIGIN, "the loopy site may read the answer");
r = await call("GET", `/f/${ID}`, undefined, "https://evil.example");
ok(!r.h.get("Access-Control-Allow-Origin"), "another site may not read the answer");
ok((await call("GET", "/f/not-an-id")).n === 404, "a bad id: 404");
ok((await call("PUT", `/f/${ID}`, { k: KEY, b: copy(1) })).n === 405, "PUT is not allowed");

r = await call("POST", `/f/${ID}`, { k: KEY, b: copy(1) });
ok(r.n === 200 && /^[0-9a-f]{32}$/.test(r.j.e), "a new family saves its first copy");
const e1 = r.j.e;
ok((await call("POST", `/f/${ID}`, { k: KEY, b: copy(9) })).n === 412, "saving without the hash of the copy read: 412");
r = await call("GET", `/f/${ID}?e=${e1}`);
ok(r.n === 204, "unchanged copy: 204, no body");
r = await call("GET", `/f/${ID}?e=`);
ok(r.n === 200 && r.j.e === e1 && r.j.b === copy(1), "read the copy");
ok(r.h.get("Cache-Control") === "no-store", "never cached");

ok((await call("POST", `/f/${ID}?e=${e1}`, { k: OTHER, b: copy(2) })).n === 403, "the wrong write key: 403");
ok((await call("POST", `/f/${ID}?e=${e1}`, { k: KEY, b: copy(2) })).n === 429, "a second save within 10 seconds: 429");
ok((await call("POST", `/f/${ID}?e=${e1}`, { k: KEY, b: copy(1) })).n === 200, "saving the same copy again is fine");
env.DB.rows.get(ID).t -= 11000;
r = await call("POST", `/f/${ID}?e=${e1}`, { k: KEY, b: copy(2) });
ok(r.n === 200 && r.j.e !== e1, "a later save over the copy read: 200, new hash");
const e2 = r.j.e;
env.DB.rows.get(ID).t -= 11000;
r = await call("POST", `/f/${ID}?e=${e1}`, { k: KEY, b: copy(3) });
ok(r.n === 412 && r.j.e === e2, "a save over an older copy: 412 with the new hash");

ok((await call("POST", `/f/${ID}?e=${e2}`, { k: KEY, b: "not json" })).n === 400, "a copy that is not locked: 400");
ok((await call("POST", `/f/${ID}?e=${e2}`, { k: KEY, b: JSON.stringify({ v: 1, iv: "x", d: "AAAA" }) })).n === 400, "a bad lock: 400");
ok((await call("POST", `/f/${ID}?e=${e2}`, { k: KEY, b: "x".repeat(90000) })).n === 413, "too big: 413");
ok((await call("POST", `/f/${ID}?e=${e2}`, { k: "short", b: copy(4) })).n === 400, "a bad key: 400");

ok((await call("POST", `/f/${ID}?del=1`, { k: OTHER })).n === 403, "delete with the wrong key: 403");
ok((await call("POST", `/f/${ID}?del=1`, { k: KEY })).n === 200, "delete with the key: 200");
ok((await call("GET", `/f/${ID}?e=`)).n === 404, "after delete: 404");

await call("POST", `/f/${ID}`, { k: KEY, b: copy(5) });
env.DB.rows.get(ID).t = Date.now() - 401 * 86400000;
await worker.scheduled({}, env);
ok(!env.DB.rows.has(ID), "the daily job deletes copies not saved for 400 days");

// Nightly counts: one row a day, counts only.
const ID2 = "fedcba9876543210fedcba9876543210";
await call("POST", `/f/${ID}`, { k: KEY, b: copy(6) });
await call("POST", `/f/${ID2}`, { k: KEY, b: copy(7) });
env.DB.rows.get(ID2).t = Date.now() - 10 * 86400000;
await worker.scheduled({}, env);
r = await call("GET", "/stats");
ok(r.n === 200 && r.j.length === 1 && r.j[0].families === 2 && r.j[0].active7 === 1 && r.j[0].active30 === 2 && r.j[0].bytes > 0, "the daily job writes today's counts, and GET /stats shows them");
ok(/^\d{4}-\d\d-\d\d$/.test(r.j[0].day) && Object.keys(r.j[0]).join() === "day,families,active7,active30,bytes", "a stats row holds the day and counts, nothing else");
await worker.scheduled({}, env);
ok((await call("GET", "/stats")).j.length === 1, "running the job twice in a day keeps one row");
ok((await call("POST", "/stats")).n === 405, "POST /stats is not allowed");

// Stay in touch: a grown-up's email, with a remove key kept on the device.
const MAIL = "Parent@Example.com", RK = "C".repeat(43), RK2 = "D".repeat(43);
ok((await call("POST", "/g", { m: "not an email", l: "en", k: RK })).n === 400, "not an email: 400");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: "short" })).n === 400, "a bad remove key: 400");
ok((await call("POST", "/g", { m: "a@b.c", l: "en", k: RK })).n === 400, "a too short domain: 400");
ok((await call("GET", "/g")).n === 405, "GET /g is not allowed");
r = await call("POST", "/g", { m: " " + MAIL + " ", l: "de", k: RK });
ok(r.n === 200 && db.grownups.has("parent@example.com") && db.grownups.get("parent@example.com").l === "de", "an email is saved, trimmed and in lower case, with its language");
ok(db.grownups.get("parent@example.com").k !== RK && !JSON.stringify([...db.grownups]).includes(RK), "the server keeps only a hash of the remove key");
ok(Object.keys(db.grownups.get("parent@example.com")).join() === "k,l,t,f" && db.grownups.get("parent@example.com").f === null, "a row holds only the key hash, language, time and an empty family link");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK })).n === 429, "saving the same email again within 10 seconds: 429");
db.grownups.get("parent@example.com").t -= 11000;
const firstKey = db.grownups.get("parent@example.com").k, firstTime = db.grownups.get("parent@example.com").t;
r = await call("POST", "/g", { m: MAIL, l: "en", k: RK2 });
ok(r.n === 200 && db.grownups.get("parent@example.com").k === firstKey && db.grownups.get("parent@example.com").l === "de" && db.grownups.get("parent@example.com").t === firstTime,
  "posting a saved email with another key answers 200 like a new one, but changes nothing: no takeover, nothing to tell");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK })).n === 200 && db.grownups.get("parent@example.com").l === "en", "saving again later with the same key: 200, the language is updated");
ok((await call("POST", "/g?del=1", { m: MAIL, k: RK2 })).n === 404 && db.grownups.has("parent@example.com"), "remove with another device's key: 404, the row stays");
ok((await call("POST", "/g?del=1", { m: "nobody@example.com", k: RK2 })).n === 404, "remove an unknown email: the same 404, so the list can't be read out");
ok((await call("POST", "/g?del=1", { m: MAIL, k: RK })).n === 200 && !db.grownups.has("parent@example.com"), "remove with the right key: 200, gone");
await call("POST", "/g", { m: "old@example.com", l: "en", k: RK });
db.grownups.get("old@example.com").t = Date.now() - 731 * 86400000;
await worker.scheduled({}, env);
ok(!db.grownups.has("old@example.com"), "the daily job deletes emails saved 2 years ago");
// Linking the email to the family (issue #169): f is the family id, only when the grown-up ticked the box.
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: "not-an-id", w: KEY })).n === 400, "a link that is not a family id: 400");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: 12, w: KEY })).n === 400, "a link that is not text: 400");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: ID })).n === 400, "a link without the family's write key: 400");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: ID, w: OTHER })).n === 403, "a link with the wrong write key: 403");
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: "00000000000000000000000000000000", w: KEY })).n === 403, "a link to a family that does not exist: 403");
ok(!db.grownups.has("parent@example.com"), "a bad link saves nothing");
r = await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: ID, w: KEY });
ok(r.n === 200 && db.grownups.get("parent@example.com").f === ID, "a save with the box ticked and the family's key keeps the family id next to the email");
db.grownups.get("parent@example.com").t -= 11000;
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK2 })).n === 200 && db.grownups.get("parent@example.com").f === ID, "another device's remove key cannot change the link");
ok((await call("POST", `/f/${ID}?del=1`, { k: KEY })).n === 200 && db.grownups.has("parent@example.com") && db.grownups.get("parent@example.com").f === null, "deleting the family copy drops the link and keeps the email");
await call("POST", `/f/${ID}`, { k: KEY, b: copy(8) });
db.grownups.get("parent@example.com").t -= 11000;
await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: ID, w: KEY });
db.grownups.get("parent@example.com").t -= 11000;
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK })).n === 200 && db.grownups.get("parent@example.com").f === null, "a save without the box ticked removes the link");
db.grownups.get("parent@example.com").t -= 11000;
await call("POST", "/g", { m: MAIL, l: "en", k: RK, f: ID, w: KEY });
db.rows.get(ID).t = Date.now() - 401 * 86400000;
await worker.scheduled({}, env);
ok(!db.rows.has(ID) && db.grownups.get("parent@example.com").f === null, "when the nightly job deletes an old copy, the link to it goes too");
ok((await call("POST", "/g?del=1", { m: MAIL, k: RK })).n === 200 && !db.grownups.has("parent@example.com"), "remove still deletes the row");
await call("POST", `/f/${ID}`, { k: KEY, b: copy(8) });   // the family copy again, for the tests below
ok((await call("POST", "/g", { m: MAIL, l: "en", k: RK }, "https://evil.example")).n === 200 && !(await call("POST", "/g?del=1", { m: MAIL, k: RK }, "https://evil.example")).h.get("Access-Control-Allow-Origin"), "another site gets no answer it can read");
const noMail = { ...env, GROWNUPS: undefined };
ok((await worker.fetch(new Request("https://sync.test/g", { method: "POST", body: JSON.stringify({ m: MAIL, l: "en", k: RK }), headers: { Origin: ORIGIN, "Content-Type": "text/plain" } }), noMail)).status === 503, "without the emails database: 503");

// Too many requests from one address: the Rate Limiting bindings (wrangler.toml), with a stand-in that allows
// 3 a minute. Every test above ran without the bindings and without an address, so nothing was limited there.
const limiter = (allow) => { const seen = new Map(); return { limit: async ({ key }) => { seen.set(key, (seen.get(key) || 0) + 1); return { success: seen.get(key) <= allow }; }, seen }; };
const limited = { ...env, LIMIT: limiter(3), LIMIT_MAIL: limiter(3) };
const from = (ip, method, path, body, e = limited) => worker.fetch(new Request("https://sync.test" + path, { method, body: body === undefined ? undefined : JSON.stringify(body),
  headers: { Origin: ORIGIN, "Content-Type": "text/plain", ...(ip ? { "CF-Connecting-IP": ip } : {}) } }), e).then(r => r.status);
let codes = [];
for (let i = 0; i < 4; i++) codes.push(await from("1.2.3.4", "GET", `/f/${ID}?e=`));
ok(codes.join() === "200,200,200,429", "the 4th request in a minute from one address: 429 (" + codes.join() + ")");
ok((await from("5.6.7.8", "GET", `/f/${ID}?e=`)) === 200, "another address is not limited");
ok((await from("1.2.3.4", "GET", "/stats")) === 429, "/stats counts under the same limit");
codes = [];
for (let i = 0; i < 4; i++) codes.push(await from("1.2.3.4", "POST", "/g", { m: `p${i}@example.com`, l: "en", k: RK }));
ok(codes.join() === "200,200,200,429", "Stay in touch has its own limit: the 4th in a minute from one address is 429 (" + codes.join() + ")");
ok(limited.LIMIT.seen.get("1.2.3.4") === 5 && limited.LIMIT_MAIL.seen.get("1.2.3.4") === 4, "the copies and the emails are counted apart");
ok((await from("", "GET", `/f/${ID}?e=`)) === 200, "a request with no address (the tests, wrangler dev) is not limited");
const broken = { ...env, LIMIT: { limit: async () => { throw new Error("down"); } } };
ok((await from("1.2.3.4", "GET", `/f/${ID}?e=`, undefined, broken)) === 200, "a limiter that fails lets the request through");
for (const m of ["p0", "p1", "p2"]) db.grownups.delete(m + "@example.com");

console.log(fails ? `${fails} failed` : "All sync server tests pass.");
process.exit(fails ? 1 : 0);
