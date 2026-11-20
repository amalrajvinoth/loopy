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
