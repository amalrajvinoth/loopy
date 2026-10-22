// Tests for the Family sync server (sync/worker.js), with a stand-in database. Run: node sync/test.mjs
import worker from "./worker.js";
import { fakeD1 } from "./fake-d1.mjs";

const env = { DB: fakeD1(), ORIGINS: "https://amalrajvinoth.github.io" };
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

console.log(fails ? `${fails} failed` : "All sync server tests pass.");
process.exit(fails ? 1 : 0);
