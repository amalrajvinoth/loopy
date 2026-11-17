// End-to-end test for switching the child in the middle of a game (Plus and Minus, English). See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the play test)
//   node tools/e2e/switch.mjs                     (exit code 1 if anything fails)
//
// Two children, Dio (1) and Max (2):
//   1. Dio gets 3 right. Dio's stars, answer log and "last game" are saved under Dio's keys, Max has nothing.
//   2. The child chip in the top bar opens "Who is playing?" with both children, Dio marked. Picking Max reloads
//      the page for Max: 0 stars, a fresh score, the chip says Max, and Max's "last game" is Plus and Minus too.
//   3. Max gets 2 right: Max has 2 stars, Dio still 3, and each child's log counts only their own answers.
//   4. A save started right after a switch lands under neither child (the guard in Loopy.store).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");

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

async function launch() {
  const tries = [];
  if (process.env.CHROME) tries.push({ executablePath: process.env.CHROME });
  for (const p of ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"])
    if (fs.existsSync(p)) tries.push({ executablePath: p });
  tries.push({ channel: "chrome" });
  for (const t of tries) { try { return await chromium.launch(t); } catch (e) { /* try the next one */ } }
  throw new Error("No Chrome or Chromium found. Set CHROME=/path/to/chrome.");
}
const browser = await launch();
const problems = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) problems.push(what); };

const GAME = "math/plus-minus/";
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
ctx.setDefaultTimeout(5000);
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
await page.addInitScript(() => {
  if (localStorage.getItem("loopy.kids")) return;
  localStorage.setItem("loopy.kids", JSON.stringify({ on: 1, next: 3, list: [{ id: 1, name: "Dio", pic: "🐰" }, { id: 2, name: "Max", pic: "🦊" }] }));
  localStorage.setItem("loopy.lang", "en"); localStorage.setItem("loopy.sound", "off");
});

// What is saved for one child: a JSON key parsed, or the raw text.
const saved = (id, k, json = true) => page.evaluate(([id, k, json]) => {
  const v = localStorage.getItem("loopy.kid." + id + "." + k);
  return json && v ? JSON.parse(v) : v;
}, [id, k, json]);
const stars = async (id) => ((await saved(id, "loopy.rewards")) || { stars: 0 }).stars;
const logged = async (id) => {
  const log = await saved(id, "loopy.log");
  const today = await page.evaluate(() => Loopy.dayKey(0));
  return log && log.days && log.days[today] && log.days[today]["plus-minus"] ? log.days[today]["plus-minus"].slice(0, 2) : [0, 0];
};
const shown = () => page.evaluate(() => +document.querySelector("[data-loopy-stars]").textContent);
const chipName = () => page.locator(".game-bar .kid-chip .kid-chip-name").textContent();

// Answers the sum on screen with the right number, then Next.
async function right() {
  const n = await page.evaluate(() => {
    const num = id => parseInt(document.getElementById(id).textContent.replace(/\D/g, ""), 10);
    return document.getElementById("op-sign").textContent === "+" ? num("top-num") + num("bot-num") : num("top-num") - num("bot-num");
  });
  for (const d of String(n)) await page.click(`#pad [data-d="${d}"]`);
  await page.click("#k-go");
  await page.waitForTimeout(150);
  const big = page.locator(".loopy-cheer.big");
  if (await big.count()) { await big.locator("button").last().click(); await page.waitForTimeout(200); }
  await page.click("#k-go");
  await page.waitForTimeout(100);
}

console.log("1. Dio plays");
await page.goto(BASE + GAME);
await page.waitForTimeout(300);
check((await chipName()) === "Dio", "the top bar says Dio is playing");
for (let i = 0; i < 3; i++) await right();
check((await stars(1)) === 3, "Dio has 3 stars saved");
check((await shown()) === 3, "the star counter shows 3");
check((await saved(2, "loopy.rewards")) === null, "Max has no stars saved yet");
check((await saved(1, "loopy.last", false)) === GAME, "Dio's last game is Plus and Minus");
check((await saved(2, "loopy.last", false)) === null, "Max has no last game yet");
check(JSON.stringify(await logged(1)) === "[3,0]", "Dio's answer log counts 3 right");

console.log("2. Switch to Max from the top bar");
await page.click(".game-bar .kid-chip");
const sheet = page.locator(".kid-switch");
check(await sheet.isVisible(), "the Who is playing? sheet opens");
const rows = sheet.locator(".kid-list .kid-row");
check((await rows.count()) === 2, "it lists both children");
check((await rows.first().getAttribute("aria-pressed")) === "true", "Dio is marked as playing");
await Promise.all([page.waitForEvent("load"), rows.nth(1).click()]);
await page.waitForTimeout(300);
check((await page.evaluate(() => JSON.parse(localStorage.getItem("loopy.kids")).on)) === 2, "Max is the child playing now");
check((await chipName()) === "Max", "the top bar says Max");
check((await shown()) === 0, "the star counter starts at 0 for Max");
check((await page.locator("#score").textContent()).replace(/\s/g, "") === "0/0", "the score starts afresh");
check((await stars(1)) === 3, "Dio still has 3 stars");
check((await saved(2, "loopy.last", false)) === GAME, "Max's last game is Plus and Minus now");
check((await saved(1, "loopy.last", false)) === GAME, "Dio's last game is still Plus and Minus");

console.log("3. Max plays");
for (let i = 0; i < 2; i++) await right();
check((await stars(2)) === 2, "Max has 2 stars saved");
check((await stars(1)) === 3, "Dio still has 3 stars");
check(JSON.stringify(await logged(2)) === "[2,0]", "Max's answer log counts 2 right");
check(JSON.stringify(await logged(1)) === "[3,0]", "Dio's answer log still counts 3 right");

console.log("4. A save right after a switch lands nowhere");
try {
  await Promise.all([page.waitForEvent("load"), page.evaluate(() => { Loopy.kids.use(1); Loopy.store.set("loopy.probe", "late"); })]);
} catch (e) { /* the reload can cut the script short; the keys below say what happened */ }
await page.waitForTimeout(300);
check((await saved(1, "loopy.probe", false)) === null && (await saved(2, "loopy.probe", false)) === null, "the late save was dropped for both children");
check((await stars(1)) === 3 && (await stars(2)) === 2, "both children keep their stars after the switch back");
check((await chipName()) === "Dio", "the top bar says Dio again");

check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.join("; ") : ""));
await ctx.close();
await browser.close();
server.close();
if (problems.length) { console.log(`\n${problems.length} problem(s)`); process.exit(1); }
console.log("\nNo problems found.");
