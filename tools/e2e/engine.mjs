// One browser for every test. Chromium by default; ENGINE=webkit runs the same test in WebKit, the
// engine behind Safari on iPhone and iPad, so a layout or script slip that only Safari shows is caught
// before a child's phone meets it. The GitHub check runs the play test and the accessibility check in both.
//
//   node tools/e2e/play.mjs                 Chromium (Chrome on GitHub's runners, the pre-installed Chromium
//                                           in Claude's cloud, or CHROME=/path/to/chrome)
//   ENGINE=webkit node tools/e2e/play.mjs   WebKit. Install it once with the same playwright-core the tests use:
//                                           node tools/a11y/node_modules/playwright-core/cli.js install --with-deps webkit
//   ENGINE=pinned node tools/e2e/pictures.mjs   Playwright's own Chromium build (the version its package-lock pins), so a
//                                           picture never changes because the runner's Chrome did. Install it once:
//                                           node tools/a11y/node_modules/playwright-core/cli.js install chromium-headless-shell
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const playwright = require("playwright-core");

/** "chromium", "webkit" or "pinned", from ENGINE. Tests print it in their table and use it for engine-only steps. */
export const ENGINE = ["webkit", "pinned"].includes(process.env.ENGINE) ? process.env.ENGINE : "chromium";

/**
 * A file's bytes as the test servers send them. In WebKit a page's `upgrade-insecure-requests` directive is
 * dropped: WebKit upgrades even http://127.0.0.1 to https (Chromium leaves the loopback address alone, as the
 * spec says), and the test servers speak only http, so without this nothing after the page itself would load.
 * The real site is https, where the directive changes nothing.
 */
export function body(file) {
  const bytes = fs.readFileSync(file);
  if (ENGINE === "webkit" && file.endsWith(".html")) return Buffer.from(String(bytes).replace(/;\s*upgrade-insecure-requests/, ""));
  return bytes;
}

export async function launch() {
  if (ENGINE === "webkit") {
    try { return await playwright.webkit.launch(); }
    catch (e) {
      throw new Error("WebKit is not installed for ENGINE=webkit. Run: node tools/a11y/node_modules/playwright-core/cli.js install --with-deps webkit\n" + e.message);
    }
  }
  if (ENGINE === "pinned") {
    try { return await playwright.chromium.launch(); }
    catch (e) {
      throw new Error("Playwright's Chromium is not installed for ENGINE=pinned. Run: node tools/a11y/node_modules/playwright-core/cli.js install chromium-headless-shell\n" + e.message);
    }
  }
  const tries = [];
  if (process.env.CHROME) tries.push({ executablePath: process.env.CHROME });
  for (const p of ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"])
    if (fs.existsSync(p)) tries.push({ executablePath: p });
  tries.push({ channel: "chrome" });
  for (const t of tries) { try { return await playwright.chromium.launch(t); } catch (e) { /* try the next one */ } }
  throw new Error("No Chrome or Chromium found. Set CHROME=/path/to/chrome.");
}

/**
 * The pages a test covers this run. PAGES comes from tools/ci_changes.py: unset or "all" keeps the test's whole
 * list; a JSON list of site paths such as ["math/plus-minus/"] keeps only those, so a change to one game tests that
 * game. Nothing left means nothing to test: the test says so and passes, before it starts a browser.
 */
export function picked(list) {
  const want = process.env.PAGES;
  if (!want || want === "all") return list;
  let keep;
  try { keep = JSON.parse(want); } catch { keep = null; }
  if (!Array.isArray(keep)) throw new Error(`PAGES must be "all" or a JSON list of pages such as ["math/plus-minus/"], not ${want}`);
  const out = list.filter(p => keep.includes(p));
  if (!out.length) {
    console.log(`No page to test here: PAGES (${want}) names none of this test's pages.`);
    process.exit(0);
  }
  return out;
}

/**
 * Open one page and let it paint before the tests start, and say how long that took. A fresh runner's first page
 * pays once for the browser's start: in WebKit the font caches are built while the first emoji and chess pieces are
 * drawn, and the page then draws no frames for seconds. Without this, the first tap of the first game waited for
 * that (Chess Puzzles at age 5, the first game in part 1). Every tap after it still has the usual 5 seconds.
 */
export async function warmUp(browser, url) {
  const t0 = performance.now(), ctx = await browser.newContext();
  try {
    const p = await ctx.newPage();
    await p.goto(url, { timeout: 60000 });
    await p.evaluate(() => document.fonts.ready.then(() => new Promise(f => requestAnimationFrame(() => requestAnimationFrame(f)))));
  } finally { await ctx.close(); }
  console.error(`warm-up (${ENGINE}): ${((performance.now() - t0) / 1000).toFixed(1)}s`);
}
