// How many families use Family sync? Prints a small Markdown report. Run by .github/workflows/sync-usage.yml,
// inside sync/ with the database ids filled into wrangler.toml. Counts only: no ids, no names, no emails.
//
//   node tools/sync-usage.mjs      (needs wrangler logged in, or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)

import { execFileSync } from "node:child_process";

const W = process.env.WRANGLER || "wrangler@4.149.0";
const DAY = 86400000;

function query(db, sql) {
  const out = execFileSync("npx", ["--yes", W, "d1", "execute", db, "--remote", "--json", "--command", sql],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  const j = JSON.parse(out.slice(out.indexOf("[")));
  return (j[0] && j[0].results) || [];
}

const kb = n => (Number(n || 0) / 1024).toFixed(0) + " KB";
const now = Date.now();
const [c] = query("loopy-sync",
  "SELECT COUNT(*) AS families, COALESCE(SUM(t > " + (now - DAY) + "), 0) AS d1, COALESCE(SUM(t > " + (now - 7 * DAY) + "), 0) AS d7, "
  + "COALESCE(SUM(t > " + (now - 30 * DAY) + "), 0) AS d30, COALESCE(SUM(length(b)), 0) AS bytes FROM families");
const nights = query("loopy-sync", "SELECT day, families, active7, active30, bytes FROM stats ORDER BY day DESC LIMIT 14");
let grownups = "not set up";
if (process.env.HAS_GROWNUPS) {
  const [g] = query("loopy-grownups", "SELECT COUNT(*) AS n FROM grownups");
  grownups = String(g ? g.n : 0);
}

const lines = [
  "## Family sync usage, " + new Date(now).toISOString().slice(0, 16).replace("T", " ") + " UTC",
  "",
  "| What | How many |",
  "| --- | --- |",
  "| Families with sync on | " + c.families + " |",
  "| Saved in the last 24 hours | " + c.d1 + " |",
  "| Saved in the last 7 days | " + c.d7 + " |",
  "| Saved in the last 30 days | " + c.d30 + " |",
  "| Size of all locked copies | " + kb(c.bytes) + " |",
  "| Grown-ups on the Stay in touch list | " + grownups + " |",
  "",
  "### Nightly counts, newest first",
  "",
];
if (nights.length) {
  lines.push("| Night | Families | Active 7 days | Active 30 days | Size |", "| --- | --- | --- | --- | --- |");
  for (const r of nights) lines.push("| " + r.day + " | " + r.families + " | " + r.active7 + " | " + r.active30 + " | " + kb(r.bytes) + " |");
} else {
  lines.push("No nightly rows yet. The first one is written at 03:17 UTC after the server was last deployed.");
}
lines.push("", "Counts only. The server has no names, no family codes and no IP addresses, so nobody can see who.", "");
process.stdout.write(lines.join("\n"));
