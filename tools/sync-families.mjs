// One row per family on the Family sync server, for the owner's own screen. Never run this on GitHub: the
// Actions log is public, and the Stay in touch emails at the end are personal.
//
//   cd ~/personal/work/loopy
//   npm ci --prefix sync --ignore-scripts   once: wrangler, the exact version from sync/package-lock.json
//   sync/node_modules/.bin/wrangler login   once; it opens the browser
//   node tools/sync-families.mjs
//
// It shows everything the server holds that names nobody: a 6-letter handle made from the random family id,
// the last save in your time zone, the days since, and the size of the locked copy. Then how many families
// saved today, this week, this month or longer ago, and the Stay in touch list (email, language, saved, and
// the family handle when the grown-up ticked "Also link my email to our Family sync", so you can see which
// family copy goes with which email).
// The server cannot open a locked copy, so there is no column for children, stars or games, on purpose.
// Run it from the repo root, not from sync/, so wrangler finds the databases by name.

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { query, DAY, kb } from "./sync-d1.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const now = Date.now();
const when = ms => new Date(ms).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const ago = ms => { const d = Math.floor((now - ms) / DAY); return d === 0 ? "today" : d === 1 ? "1 day" : d + " days"; };
const pad = (s, n) => String(s).padEnd(n);

const rows = query("loopy-sync", "SELECT substr(id, 1, 6) AS f, t, length(b) AS bytes FROM families ORDER BY t DESC", root);
const out = [];
out.push("Families on the sync server: " + rows.length + " (" + when(now) + ")", "");
if (rows.length) {
  out.push(pad("Family", 8) + pad("Last save", 22) + pad("Ago", 10) + "Copy");
  for (const r of rows) out.push(pad(r.f, 8) + pad(when(Number(r.t)), 22) + pad(ago(Number(r.t)), 10) + kb(r.bytes));
  out.push("");
  const bucket = [["today", 1], ["this week", 7], ["this month", 30]];
  let left = rows.slice();
  for (const [name, days] of bucket) {
    const n = left.filter(r => now - Number(r.t) <= days * DAY).length;
    left = left.filter(r => now - Number(r.t) > days * DAY);
    out.push("Saved " + name + ": " + n);
  }
  out.push("Longer ago: " + left.length);
  out.push("All copies together: " + kb(rows.reduce((s, r) => s + Number(r.bytes), 0)));
  out.push("");
}
out.push("A family is a random id. The copy is locked on the family's devices, so this is all the server knows.", "");

let gr = [];
try { gr = query("loopy-grownups", "SELECT m, l, t, substr(f, 1, 6) AS f FROM grownups ORDER BY t DESC", root); }
catch (e) { out.push("Stay in touch list: could not read loopy-grownups (" + (e.message || e).split("\n")[0] + ")", ""); gr = null; }
if (gr) {
  out.push("Stay in touch list: " + gr.length + (gr.length ? ". These are personal: keep them on this screen." : ""));
  for (const g of gr) out.push("  " + pad(g.l, 4) + pad(when(Number(g.t)), 22) + pad(g.f || "-", 8) + g.m);
  if (gr.length) out.push("  The third column is the family handle from the list above, when the grown-up linked the email; - when not.");
  out.push("");
}
process.stdout.write(out.join("\n"));
