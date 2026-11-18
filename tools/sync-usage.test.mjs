// Tests for tools/sync-usage.mjs and tools/sync-families.mjs with a stand-in database (no network).
// Run: node tools/sync-usage.test.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "loopy-sync-usage-"));
const DAY = 86400000, now = Date.now();
const day = ms => new Date(ms).toISOString().slice(0, 10);
// Three families: one saved today, one 3 days ago, one 40 days ago (quiet). Two grown-ups. Nine weeks of nights.
const fam = [{ id: "a1b2c3" + "0".repeat(26), t: now - 3600000, b: "x".repeat(2048) },
  { id: "d4e5f6" + "0".repeat(26), t: now - 3 * DAY, b: "x".repeat(1024) },
  { id: "0a0b0c" + "0".repeat(26), t: now - 40 * DAY, b: "x".repeat(512) }];
const nights = [];
for (let d = 0; d < 63; d++) nights.push({ day: day(now - d * DAY), families: d < 7 ? 3 : d < 21 ? 2 : 1 });
const grown = [{ m: "one@example.com", l: "de", t: now - 2 * DAY }, { m: "two@example.com", l: "en", t: now - 9 * DAY }];
writeFileSync(join(dir, "data.json"), JSON.stringify({ fam, nights, grown, now }));
writeFileSync(join(dir, "fake.mjs"), `
import { readFileSync } from "node:fs";
const { fam, nights, grown } = JSON.parse(readFileSync(process.argv[1].replace(/fake\\.mjs$/, "data.json"), "utf8"));
const [,, db, sql] = process.argv;
const num = s => Number(/\\d+/.exec(s)[0]);
let results;
if (/FROM families$/.test(sql) && /COUNT/.test(sql)) {
  const ts = [...sql.matchAll(/t > (\\d+)/g)].map(m => Number(m[1]));
  results = [{ families: fam.length, d1: fam.filter(f => f.t > ts[0]).length, d7: fam.filter(f => f.t > ts[1]).length,
    d30: fam.filter(f => f.t > ts[2]).length, bytes: fam.reduce((s, f) => s + f.b.length, 0) }];
} else if (/FROM stats/.test(sql)) {
  const since = /'(\\d{4}-\\d\\d-\\d\\d)'/.exec(sql)[1];
  results = nights.filter(n => n.day >= since).sort((a, b) => b.day < a.day ? -1 : 1).map(n => ({ day: n.day, families: n.families }));
} else if (/GROUP BY l/.test(sql)) {
  const c = {}; for (const g of grown) c[g.l] = (c[g.l] || 0) + 1;
  results = Object.keys(c).sort().map(l => ({ l, n: c[l] }));
} else if (/substr\\(id/.test(sql)) {
  results = fam.map(f => ({ f: f.id.slice(0, 6), t: f.t, bytes: f.b.length })).sort((a, b) => b.t - a.t);
} else if (/FROM grownups/.test(sql)) {
  results = grown.slice().sort((a, b) => b.t - a.t);
} else throw new Error("fake D1: unknown query on " + db + ": " + sql);
process.stdout.write("Some wrangler chatter\\n" + JSON.stringify([{ results }]));
`);

let fails = 0;
const ok = (cond, what) => { if (!cond) { fails++; console.log("FAIL: " + what); } else console.log("ok   " + what); };
const run = (script, env) => execFileSync(process.execPath, [script], { encoding: "utf8", env: { ...process.env, SYNC_D1_FAKE: join(dir, "fake.mjs"), ...env } });

// First run: no last week, no news, and nothing personal.
let out = dir + "/first";
let r = run("tools/sync-usage.mjs", { OUT: out, HAS_GROWNUPS: "1" });
ok(/\| Families with sync on \| 3 \| – \|/.test(r), "first run: 3 families, no last-week column yet");
ok(/\| Saved in the last 7 days \| 2 \| – \|/.test(r), "2 saved this week");
ok(/\| Quiet for 30 days \| 1 \| – \|/.test(r), "1 quiet family");
ok(/\| Grown-ups on the Stay in touch list \| 2 \(1 de, 1 en\) \| – \|/.test(r), "grown-ups by language");
ok(/last 8 weeks: 1 · 1 · 1 · 1 · 1 · 2 · 2 · 3\./.test(r), "weekly trend from the nightly rows: " + (/weeks: ([^\n]*)/.exec(r) || [])[1]);
ok(!/New since|Nothing new/.test(r), "no news line on the first run");
ok(readFileSync(out + "/news", "utf8") === "0", "no comment due on the first run");
const body = readFileSync(out + "/body.md", "utf8");
ok(/<!-- loopy-sync-counts families=3 active7=2 active30=2 quiet=1 bytes=3584 grownups=2 -->/.test(body), "the issue text keeps this week's counts in a hidden line");
ok(!/example\.com|a1b2c3/.test(r + body), "no emails and no family ids in the report");

// Second run, with last week's counts: one family and one grown-up new, one went quiet.
out = dir + "/second";
r = run("tools/sync-usage.mjs", { OUT: out, HAS_GROWNUPS: "1", LAST: "families=2 active7=2 active30=2 quiet=0 bytes=2048 grownups=1" });
ok(/New since last week: 1 family turned sync on, 1 family went quiet \(no save for 30 days\), 1 grown-up joined the Stay in touch list\./.test(r), "news line names what changed");
ok(/\| Families with sync on \| 3 \| 2 \|/.test(r) && /\| Size of all locked copies \| 4 KB \| 2 KB \|/.test(r), "last week column filled");
ok(readFileSync(out + "/news", "utf8") === "1", "a comment is due");

// Same counts as last week: nothing new, no comment.
out = dir + "/same";
r = run("tools/sync-usage.mjs", { OUT: out, HAS_GROWNUPS: "1", LAST: "families=3 active7=2 active30=2 quiet=1 bytes=3584 grownups=2" });
ok(/Nothing new since last week\./.test(r) && readFileSync(out + "/news", "utf8") === "0", "nothing new: no comment");
ok(!/New since/.test(r), "fewer families than last week is not news");

// Without the grown-ups database.
r = run("tools/sync-usage.mjs", {});
ok(/\| Grown-ups on the Stay in touch list \| not set up \| – \|/.test(r), "no grown-ups database: says so");

// The owner's own table: one row per family, buckets, and the emails at the end.
r = run("tools/sync-families.mjs", {});
ok(/Families on the sync server: 3/.test(r), "families script counts 3");
ok(/^a1b2c3 .*today .*2 KB$/m.test(r) && /^0a0b0c .*40 days .*1 KB$/m.test(r), "one row per family with handle, ago and size");
ok(/Saved today: 1\nSaved this week: 1\nSaved this month: 0\nLonger ago: 1/.test(r), "buckets");
ok(/Stay in touch list: 2\. These are personal.*\n  de .*one@example\.com\n  en .*two@example\.com/.test(r), "grown-ups listed with a warning");

console.log(fails ? fails + " failed" : "all passed");
process.exit(fails ? 1 : 0);
