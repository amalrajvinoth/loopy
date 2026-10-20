// Check the built guide (run `npm run build` first):
//   1. Every link and picture on every page points to something that exists (guide or games).
//   2. In Chrome: no script errors, no console errors, nothing blocked by the security policy,
//      nothing loaded from another website.
//   3. Accessibility (axe-core, WCAG 2.1 AA), on every page in dark and light colors.
//
//   npm ci --prefix ../tools/a11y --ignore-scripts    (once: the same Chrome driver as the play test)
//   npm run check
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { start } from "./serve.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const DIST = path.resolve(HERE, "../dist");
const problems = [];

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith(".html")) pages.push(p);
  }
})(DIST);

// 1. Links and pictures.
const exists = (url) => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  const file = clean.startsWith("/loopy/guide/") ? path.join(DIST, clean.slice("/loopy/guide/".length)) : path.join(ROOT, clean.slice("/loopy/".length));
  return fs.existsSync(file) && (fs.statSync(file).isFile() || fs.existsSync(path.join(file, "index.html")));
};
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (url.startsWith("#") || url.startsWith("data:")) continue;
    if (/^https:\/\/github\.com\/amalrajvinoth\/loopy\b/.test(url)) continue;
    if (!url.startsWith("/loopy/")) { problems.push(`${path.relative(DIST, page)}: links to ${url}`); continue; }
    if (!exists(url)) problems.push(`${path.relative(DIST, page)}: broken link ${url}`);
  }
}

// 2. Every page in Chrome.
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");
async function launch() {
  for (const p of [process.env.CHROME, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"])
    if (p && fs.existsSync(p)) return chromium.launch({ executablePath: p });
  return chromium.launch({ channel: "chrome" });
}
const { server, origin } = await start();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
await ctx.addInitScript(() => document.addEventListener("securitypolicyviolation", (e) => console.error(`blocked by the policy: ${e.violatedDirective} ${e.blockedURI}`)));
const p = await ctx.newPage();
let where = "";
p.on("pageerror", (e) => problems.push(`${where}: script error: ${e.message}`));
p.on("console", (m) => { if (m.type() === "error") problems.push(`${where}: ${m.text()}`); });
p.on("request", (r) => { if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) problems.push(`${where}: loads ${r.url()}`); });
p.on("response", (r) => { if (r.status() >= 400 && !r.url().endsWith("/favicon.ico")) problems.push(`${where}: ${r.status()} ${r.url()}`); });
const axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const AXE = { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] };
for (const scheme of ["dark", "light"]) {
  await p.emulateMedia({ colorScheme: scheme });
  for (const page of pages) {
    const rel = path.relative(DIST, page).replace(/index\.html$/, "");
    where = `${rel || "home"} (${scheme})`;
    if (rel === "404.html") continue;
    await p.goto(`${origin}/loopy/guide/${rel}`);
    // axe runs as a page script, so it is added here without the page's own security policy in the way.
    await p.evaluate(axe);
    const found = await p.evaluate((o) => window.axe.run(document, o), AXE);
    for (const v of found.violations) problems.push(`${where}: ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
  }
}
// Search runs a small WebAssembly file: make sure the policy lets it.
where = "search";
await p.goto(`${origin}/loopy/guide/`);
await p.click("site-search button");
await p.keyboard.type("stars");
await p.waitForSelector(".pagefind-ui__result", { timeout: 5000 }).catch(() => problems.push("search: no results for 'stars'"));
await browser.close();
server.close();

if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n${problems.length} problem(s) in the guide.`);
  process.exit(1);
}
console.log(`Checked ${pages.length} guide pages: links work, no errors, nothing from other websites, search works, no accessibility problems (dark and light).`);
