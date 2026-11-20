// Style lint: src/loopy.css, src/print.css and the <style> block of every page, against tools/lint/stylelint.config.json.
//
//   node tools/lint/check.mjs            every file (exit 1 on an error or a rule that could not run; warnings only print)
//   node tools/lint/check.mjs <files>    just these
//
// Needs the packages once: npm ci --prefix tools/lint --ignore-scripts
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(HERE, "package.json"));
let stylelint;
try { stylelint = require("stylelint"); } catch { console.error("Missing Stylelint. Run: npm ci --prefix tools/lint --ignore-scripts"); process.exit(2); }

const files = process.argv.length > 2 ? process.argv.slice(2) : ["src/*.css", "index.html", "*/*/index.html", "progress/index.html", "help/index.html", "privacy/index.html"];
const result = await stylelint.lint({ files, cwd: ROOT, configFile: path.join(HERE, "stylelint.config.json"), configBasedir: HERE, formatter: "string" });
if (result.report.trim()) console.log(result.report);
// result.errored is Stylelint's own verdict: an error-level finding, or a rule that could not run (a bad option lands in
// invalidOptionWarnings, not in warnings), so a broken config cannot pass as "no errors".
const n = result.results.reduce((a, r) => a + r.warnings.filter(w => w.severity === "error").length + (r.invalidOptionWarnings?.length || 0), 0);
const warnings = result.results.reduce((a, r) => a + r.warnings.filter(w => w.severity === "warning").length, 0);
for (const r of result.results) for (const w of r.invalidOptionWarnings || []) console.log(`${r.source}: ${w.text}`);
console.log(`Checked ${result.results.length} files: ${result.errored ? n + " error(s)" : "no errors"}${warnings ? `, ${warnings} warning(s)` : ""}.`);
process.exit(result.errored ? 1 : 0);
