// End-to-end test for the first visit (the welcome sheet and the family code row). See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the play test)
//   node tools/e2e/hello.mjs                      (exit code 1 if anything fails)
//
//   1. A browser with nothing from loopy opens the home page: the welcome sheet "Hi! Who is playing?" is up.
//      Name Mia, picture 🦄, age 7, Next. Step 2 is for grown-ups (the family code); Later. Step 3: Let's play!
//      The top row then shows Mia, the age is 7, and the one child was renamed, not doubled.
//   2. Open the home page again: no sheet (seen once). The family code row is under My stars, because no
//      family code is set. Not now hides it; a reload keeps it hidden for today.
//   3. A browser that already has stars never gets the sheet: nothing is reset. A page opened with a
//      #family= link gets neither the sheet nor the row.
//   4. A German browser with no saved language starts loopy in German; a saved English choice wins.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
import { launch, ENGINE } from "./engine.mjs";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(ROOT, url.replace(/^\/loopy\//, "/"));
  if (!url.startsWith("/loopy/") || !file.startsWith(ROOT)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/loopy/`;

const browser = await launch();
const problems = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) problems.push(what); };
const errors = [];

async function fresh(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block", ...opts });
  ctx.setDefaultTimeout(5000);
  const page = await ctx.newPage();
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  return { ctx, page };
}
const sheet = page => page.locator("dialog.hello");
const row = page => page.locator("#family-row");
const kids = page => page.evaluate(() => JSON.parse(localStorage.getItem("loopy.kids")));

// 1. The welcome sheet on a browser with nothing from loopy.
console.log("1. First visit");
const A = await fresh();
// The last check sets a (made-up) family code; the sync server is not reached from here.
await A.ctx.route("https://loopy-sync.loopy-1e2.workers.dev/**", r => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
await A.page.goto(BASE);
await sheet(A.page).waitFor({ state: "visible" });
check(await sheet(A.page).locator("h2").innerText() === "Hi! Who is playing?", "a new browser gets the welcome sheet");
check(await A.page.evaluate(() => document.activeElement && document.activeElement.tagName === "INPUT"), "the name box has the focus");
await sheet(A.page).locator("input[type=text]").fill("Mia");
await sheet(A.page).locator(".kid-pics button", { hasText: "🦄" }).click();
await sheet(A.page).getByRole("button", { name: "Younger" }).click();
check(await sheet(A.page).locator(".age-picker span").innerText() === "Age 7", "the age stepper works in the sheet");
await sheet(A.page).getByRole("button", { name: "Next" }).click();
check(await sheet(A.page).locator("h2").innerText() === "Keep the stars on every device", "step 2 is the family code, for grown-ups");
check(await sheet(A.page).getByRole("button", { name: "Make a family code" }).isVisible() && await sheet(A.page).getByRole("button", { name: "I already have a code" }).isVisible(), "step 2 offers Make a family code and I already have a code");
check(!(await A.page.evaluate(() => performance.getEntriesByType("resource").some(e => e.name.endsWith("/loopy-sync.js")))), "loopy-sync.js is not loaded until a grown-up taps");
await sheet(A.page).getByRole("button", { name: "Later" }).click();
check(await sheet(A.page).locator("h2").innerText() === "All set, Mia!", "step 3 greets the child by name");
await Promise.all([A.page.waitForEvent("load"), sheet(A.page).getByRole("button", { name: "Let's play!" }).click()]);
const k = await kids(A.page);
check(k.list.length === 1 && k.list[0].name === "Mia" && k.list[0].pic === "🦄", "the one child was renamed, not doubled: " + JSON.stringify(k.list));
check(await A.page.evaluate(() => Loopy.getAge()) === 7, "the age is 7");
check(await A.page.locator("header .kid-chip-name").innerText() === "Mia", "the top row shows Mia");
check(await A.page.evaluate(() => JSON.parse(localStorage.getItem("loopy.hello")).w) === 1, "the sheet is marked as seen");

// 2. Second visit: no sheet, the family code row until a code is set.
console.log("2. Second visit");
await A.page.goto(BASE);
await A.page.waitForTimeout(600);
check(await sheet(A.page).count() === 0, "the sheet does not come back");
await row(A.page).waitFor({ state: "visible" });
check(await row(A.page).locator("h3").innerText() === "Keep the stars on every device", "the family code row is under My stars");
check(await row(A.page).getByRole("button", { name: "Turn on" }).isVisible() && await row(A.page).getByRole("button", { name: "Join with a code" }).isVisible(), "the row offers Turn on and Join with a code");
await row(A.page).getByRole("button", { name: "Not now" }).click();
check(await row(A.page).isHidden(), "Not now hides the row");
await A.page.goto(BASE);
await A.page.waitForTimeout(800);
check(await row(A.page).isHidden(), "the row stays hidden for the rest of the day");
// Tomorrow it is back.
await A.page.evaluate(() => { const f = JSON.parse(localStorage.getItem("loopy.hello")); f.n = "2000-01-01"; localStorage.setItem("loopy.hello", JSON.stringify(f)); });
await A.page.goto(BASE);
await row(A.page).waitFor({ state: "visible" });
check(await row(A.page).isVisible(), "the row is back the next day");
// With a family code set, no row.
await A.page.evaluate(() => localStorage.setItem("loopy.sync", JSON.stringify({ c: "7K2M-QX9D-4HPT-W3RA", i: "0123456789abcdef0123456789abcdef", w: "A".repeat(43), k: "B".repeat(43) + "=", e: "", h: "", t: 0, x: 0 })));
await A.page.goto(BASE);
await A.page.waitForTimeout(800);
check(await row(A.page).isHidden(), "no row once a family code is set");
await A.ctx.close();

// 3. A browser with stars never gets the sheet; a family link gets neither.
console.log("3. Devices with data, and links");
const B = await fresh();
await B.page.addInitScript(() => { if (!localStorage.getItem("loopy.e2e")) { localStorage.setItem("loopy.e2e", "1"); localStorage.setItem("loopy.kid.1.loopy.rewards", JSON.stringify({ stars: 12, streak: 0, best: 3, badges: ["first-steps"] })); } });
await B.page.goto(BASE);
await B.page.waitForTimeout(800);
check(await sheet(B.page).count() === 0, "a browser that has stars gets no sheet");
check(await B.page.evaluate(() => Loopy.rewards.get().stars) === 12, "and keeps its 12 stars");
check(await row(B.page).isVisible(), "it gets the family code row");
await B.page.goto(BASE + "help/");
await B.page.goto(BASE + "#family=7K2MQX9D4HPTW3RA");
await B.page.waitForTimeout(800);
check(await row(B.page).isHidden() && await sheet(B.page).count() === 0, "a #family= link shows neither the row nor the sheet");
await B.ctx.close();
const C = await fresh();
await C.page.goto(BASE + "#load=LOOPY-NOTACODE");
await C.page.waitForTimeout(800);
check(await sheet(C.page).count() === 0, "a #load= link on a new browser shows no sheet");
await C.ctx.close();

// 4. The language follows the browser until a choice is saved.
console.log("4. Language");
const D = await fresh({ locale: "de-DE" });
await D.page.goto(BASE);
await sheet(D.page).waitFor({ state: "visible" });
check(await D.page.evaluate(() => document.documentElement.lang) === "de", "a German browser starts in German");
check(await sheet(D.page).locator("h2").innerText() === "Hallo! Wer spielt?", "the sheet is in German too");
check(await D.page.evaluate(() => localStorage.getItem("loopy.lang")) === null, "nothing is saved until the language pill is tapped");
await D.page.evaluate(() => localStorage.setItem("loopy.lang", "en"));
await D.page.goto(BASE);
check(await D.page.evaluate(() => document.documentElement.lang) === "en", "a saved choice wins over the browser language");
await D.ctx.close();

await browser.close();
server.close();
check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""));
if (problems.length) { console.log("\n" + problems.length + " problem(s)."); process.exit(1); }
console.log("\nAll good.");
