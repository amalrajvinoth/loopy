// What cost the points: a short, readable account of every Lighthouse run in .lighthouseci/, for the step
// log of the checks workflow. The reports themselves are kept as an artifact, but a browser is needed to
// download that; this prints the part a fix needs: each run's scores, and for a run under the budgets the
// layout shifts (which element moved, from where to where, and why) and the slowest steps to the first paint.
//
//   node tools/lighthouse/explain.mjs [folder]     default .lighthouseci
import fs from "node:fs";
import path from "node:path";

const DIR = process.argv[2] || ".lighthouseci";
const MIN = 0.95, CLS_MAX = 0.1; // the budgets in lighthouserc.json
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => /^lhr-.*\.json$/.test(f)).sort() : [];
if (!files.length) { console.log(`No reports in ${DIR}.`); process.exit(0); }

const byUrl = new Map();
for (const f of files) {
  const r = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  const url = r.finalDisplayedUrl || r.requestedUrl;
  if (!byUrl.has(url)) byUrl.set(url, []);
  byUrl.get(url).push(r);
}

const pct = (s) => s == null ? "  -" : String(Math.round(s * 100)).padStart(3);
const num = (a) => a && a.numericValue != null ? a.numericValue : null;
const ms = (a) => num(a) == null ? "-" : `${Math.round(num(a))} ms`;
const node = (n) => n ? (n.selector || n.snippet || "?").replace(/\s+/g, " ").slice(0, 90) : "(no single element)";

for (const [url, runs] of byUrl) {
  const page = url.replace(/^https?:\/\/[^/]+\/loopy\//, "") || "(home)";
  console.log(`\n${page}`);
  runs.forEach((r, i) => {
    const a = r.audits, c = r.categories;
    const cls = num(a["cumulative-layout-shift"]);
    const bad = (c.performance.score ?? 1) < MIN || (c.accessibility.score ?? 1) < MIN || (c["best-practices"].score ?? 1) < MIN || cls > CLS_MAX;
    console.log(`  run ${i + 1}: performance ${pct(c.performance.score)}  accessibility ${pct(c.accessibility.score)}  best practices ${pct(c["best-practices"].score)}` +
      `  | shift ${cls == null ? "-" : cls.toFixed(3)}  first paint ${ms(a["first-contentful-paint"])}  biggest paint ${ms(a["largest-contentful-paint"])}  blocked ${ms(a["total-blocking-time"])}${bad ? "   <- under the budget" : ""}`);
    if (!bad) return;
    // Every shift, biggest first: many small ones add up to a red CLS as surely as one big one.
    const shifts = (a["layout-shifts"]?.details?.items || []).slice().sort((x, y) => (y.score || 0) - (x.score || 0));
    for (const s of shifts) {
      console.log(`      shift ${(s.score || 0).toFixed(3)}: ${node(s.node)}`);
      for (const sub of s.subItems?.items || []) {
        const extra = sub.extra && (sub.extra.value || sub.extra.snippet || sub.extra.selector || "");
        console.log(`        because: ${sub.cause || "?"} ${String(extra).replace(/\s+/g, " ").slice(0, 100)}`);
      }
    }
    // Lighthouse 13 keeps the element of the biggest paint in the "lcp-breakdown-insight" audit (a list whose
    // node item is the element); older reports had it in "largest-contentful-paint-element".
    const lcp = (a["lcp-breakdown-insight"]?.details?.items || []).find((it) => it.type === "node") ||
      a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
    if (lcp) console.log(`      biggest paint: ${node(lcp)}`);
    // The slow steps to the first paint. Lighthouse 13 names them "-insight"; the older names stay as fallbacks.
    for (const id of ["render-blocking-insight", "render-blocking-resources", "font-display-insight", "font-display", "unused-css-rules", "uses-text-compression", "server-response-time"]) {
      const au = a[id];
      if (!au || au.score == null || au.score >= 1) continue;
      const rows = (au.details?.items || []).filter((it) => it.url).slice(0, 4)
        .map((it) => `${String(it.url).replace(/^https?:\/\/[^/]+\/loopy\//, "")}${it.wastedMs != null ? ` (${Math.round(it.wastedMs)} ms)` : ""}`);
      console.log(`      ${au.title}${au.displayValue ? `: ${au.displayValue}` : ""}${rows.length ? ` — ${rows.join(", ")}` : ""}`);
    }
  });
}
