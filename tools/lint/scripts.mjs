// Script lint: the <script> block of every page, against tools/lint/eslint.config.mjs.
//
//   node tools/lint/scripts.mjs            every page (exit 1 on an error; warnings only print)
//   node tools/lint/scripts.mjs <files>    just these pages
//
// Needs the packages once: npm ci --prefix tools/lint --ignore-scripts
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(HERE, "package.json"));
let ESLint;
try { ({ ESLint } = require("eslint")); } catch { console.error("Missing ESLint. Run: npm ci --prefix tools/lint --ignore-scripts"); process.exit(2); }

const files = process.argv.length > 2 ? process.argv.slice(2) : ["index.html", "*/*/index.html", "progress/index.html", "help/index.html", "privacy/index.html"];
const eslint = new ESLint({ cwd: ROOT, overrideConfigFile: path.join(HERE, "eslint.config.mjs") });
const results = await eslint.lintFiles(files);
const formatter = await eslint.loadFormatter("stylish");
const report = await formatter.format(results);
if (report.trim()) console.log(report);
const errors = results.reduce((a, r) => a + r.errorCount + r.fatalErrorCount, 0);
const warnings = results.reduce((a, r) => a + r.warningCount, 0);
console.log(`Checked ${results.length} pages: ${errors ? errors + " error(s)" : "no errors"}${warnings ? `, ${warnings} warning(s)` : ""}.`);
process.exit(errors ? 1 : 0);
