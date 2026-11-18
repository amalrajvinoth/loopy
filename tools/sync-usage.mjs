// How many families use Family sync? Prints a small Markdown report, counts only: no ids, no names, no emails.
// Run by .github/workflows/sync-usage.yml every Monday (and by hand), inside sync/ with the database ids
// filled into wrangler.toml. The job puts the report into one "Family sync and grown-ups" issue.
//
//   node tools/sync-usage.mjs            prints the report
//   LAST="families=5 ... grownups=2"     last week's counts (the hidden line in the issue), for a "Last week"
//                                        column and the "New since" line
//   OUT=<dir>                            writes body.md (the issue text), report.md (the comment) and news
//                                        (1 when a comment is due, else 0) instead of printing
//   HAS_GROWNUPS=1                       the loopy-grownups database exists
//
// For one row per family (on your own screen, never on GitHub) see tools/sync-families.mjs.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { query, DAY, kb, utcDay, niceDay } from "./sync-d1.mjs";

const now = Date.now();
const today = utcDay(now);

const [c] = query("loopy-sync",
  "SELECT COUNT(*) AS families, COALESCE(SUM(t > " + (now - DAY) + "), 0) AS d1, COALESCE(SUM(t > " + (now - 7 * DAY) + "), 0) AS d7, "
  + "COALESCE(SUM(t > " + (now - 30 * DAY) + "), 0) AS d30, COALESCE(SUM(length(b)), 0) AS bytes FROM families");
const nights = query("loopy-sync", "SELECT day, families FROM stats WHERE day >= '" + utcDay(now - 56 * DAY) + "' ORDER BY day DESC");

let grownups = null, byLang = "";
if (process.env.HAS_GROWNUPS) {
  const rows = query("loopy-grownups", "SELECT l, COUNT(*) AS n FROM grownups GROUP BY l ORDER BY n DESC, l");
  grownups = rows.reduce((s, r) => s + Number(r.n), 0);
  byLang = rows.length ? " (" + rows.map(r => r.n + " " + r.l).join(", ") + ")" : "";
}

const nowC = { families: Number(c.families), active7: Number(c.d7), active30: Number(c.d30),
  quiet: Number(c.families) - Number(c.d30), bytes: Number(c.bytes), grownups: grownups === null ? -1 : grownups };

// Last week's counts, from the hidden line the job keeps in the issue text. Empty on the first run.
const last = {};
for (const m of String(process.env.LAST || "").matchAll(/(\w+)=(-?\d+)/g)) last[m[1]] = Number(m[2]);
const have = Object.keys(last).length > 0;
const was = k => (have && k in last ? String(last[k]) : "–");

// What is new: a family turned sync on, a family went quiet, a grown-up joined the list.
const news = [];
const up = (k, one, many) => { if (have && k in last && nowC[k] > last[k]) { const n = nowC[k] - last[k]; news.push(n === 1 ? one : many.replace("N", String(n))); } };
up("families", "1 family turned sync on", "N families turned sync on");
up("quiet", "1 family went quiet (no save for 30 days)", "N families went quiet (no save for 30 days)");
if (grownups !== null) up("grownups", "1 grown-up joined the Stay in touch list", "N grown-ups joined the Stay in touch list");

// One number a week for the last 8 weeks, oldest first, from the nightly rows (every 7th night back from the newest).
const trend = [];
if (nights.length) {
  const byDay = new Map(nights.map(r => [r.day, Number(r.families)]));
  const newest = nights[0].day;
  for (let w = 7; w >= 0; w--) {
    const d = utcDay(Date.parse(newest + "T00:00:00Z") - w * 7 * DAY);
    if (byDay.has(d)) trend.push(byDay.get(d));
  }
}

const marker = "<!-- loopy-sync-counts " + Object.keys(nowC).map(k => k + "=" + nowC[k]).join(" ") + " -->";
const table = [
  "| What | Now | Last week |",
  "| --- | --- | --- |",
  "| Families with sync on | " + nowC.families + " | " + was("families") + " |",
  "| Saved in the last 24 hours | " + c.d1 + " | – |",
  "| Saved in the last 7 days | " + nowC.active7 + " | " + was("active7") + " |",
  "| Saved in the last 30 days | " + nowC.active30 + " | " + was("active30") + " |",
  "| Quiet for 30 days | " + nowC.quiet + " | " + was("quiet") + " |",
  "| Size of all locked copies | " + kb(nowC.bytes) + " | " + (have && "bytes" in last ? kb(last.bytes) : "–") + " |",
  "| Grown-ups on the Stay in touch list | " + (grownups === null ? "not set up" : grownups + byLang) + " | " + (grownups === null ? "–" : was("grownups")) + " |",
];
const trendLine = trend.length > 1 ? "Families, one number a week for the last " + trend.length + " weeks: " + trend.join(" · ") + "."
  : "No weekly trend yet. The sync server writes one row of counts a night; the trend shows after two weeks.";
const foot = "Counts only. The server has no names, no family codes and no IP addresses, so nobody can see who.";

const report = [
  "## Family sync and grown-ups, " + niceDay(today),
  "",
  ...(have ? [news.length ? "New since last week: " + news.join(", ") + "." : "Nothing new since last week.", ""] : []),
  ...table,
  "",
  trendLine,
  "",
  foot,
  "",
].join("\n");

const body = [
  "Every Monday the Family sync usage job writes the latest counts here. It adds a comment when a family turned sync on, a family went quiet for 30 days, or a grown-up joined the Stay in touch list. Nothing to do; it is only so the owner sees whether loopy is used. Close it any time: the next run opens a new one.",
  "",
  "Last counted: " + niceDay(today) + ".",
  "",
  ...table,
  "",
  trendLine,
  "",
  foot,
  marker,
  "",
].join("\n");

if (process.env.OUT) {
  mkdirSync(process.env.OUT, { recursive: true });
  writeFileSync(join(process.env.OUT, "report.md"), report);
  writeFileSync(join(process.env.OUT, "body.md"), body);
  writeFileSync(join(process.env.OUT, "news"), news.length ? "1" : "0");
  process.stdout.write(report);
} else {
  process.stdout.write(report);
}
