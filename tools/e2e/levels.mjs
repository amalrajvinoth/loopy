// End-to-end test for levels that follow the child (Make 10, Times Tables Sprint and Today's 10, age 8, English). See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the play test)
//   node tools/e2e/levels.mjs                     (exit code 1 if anything fails)
//
//   1. 18 of the last 20 right: with 19 answers saved (17 right), one more right answer moves Make 10 up a level
//      by itself, says so, and starts the Last 5 afresh. "Back a step" goes back down.
//   2. 10 in a row: ten right answers in a row move the game up, with "10 in a row!" as the reason.
//   3. Birthday: a child who reached level 5 at age 8 opens the game at age 9 and is still on level 5, and the
//      grown-ups' levels list says so too. A record without an age (from before) carries nothing.
//   4. The Last 5 pill shows five dots at most, and old 5-long lists still load.
//   5. Today's 10 asks each game at the level the child reached there, and the chip says the level.
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

// A page with one child, age 8 (the default age today), English, plus the given per-child keys.
async function open(url, seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  const all = { "loopy.kids": JSON.stringify({ on: 1, next: 2, list: [{ id: 1, name: "", pic: "🐰" }] }), "loopy.lang": "en", "loopy.sound": "off" };
  for (const k in seed) all["loopy.kid.1." + k] = seed[k];
  await page.addInitScript((all) => { for (const k in all) localStorage.setItem(k, all[k]); }, all);
  await page.goto(BASE + url);
  await page.waitForTimeout(200);
  return { ctx, page, errors };
}
const kid = (page, k) => page.evaluate(k => localStorage.getItem("loopy.kid.1." + k), k);
const level = (page) => page.locator("#level").getAttribute("aria-label");
// Answers the Make 10 sum on screen with the right number.
async function right(page) {
  const [a, n] = await page.evaluate(() => [document.getElementById("eq-a").textContent, document.getElementById("eq-n").textContent].map(s => parseInt(s.replace(/\D/g, ""), 10)));
  for (const d of String(n - a)) await page.click(`#k${d}`);
  await page.click("#k-go");
  await page.waitForTimeout(150);
}
const cheer = (page) => page.locator(".loopy-cheer.big");

console.log("1. 18 of the last 20 right");
{
  const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1]; // 19 answers, 17 right
  const { ctx, page, errors } = await open("math/make-10/", { "mk.lv.a8": '"100"', "loopy.recent": JSON.stringify({ "make-10": list }) });
  check((await level(page)).startsWith("Level 4 of 5"), "starts on level 4 (Make 100)");
  await right(page);
  check(await cheer(page).count() === 1 && /Level up/.test(await cheer(page).innerText()), "a right answer brings the Level up card");
  check(/18 of the last 20 right/.test(await cheer(page).innerText()), "the card says 18 of the last 20 right");
  check((await level(page)).startsWith("Level 5 of 5"), "the level is 5 now");
  check(await kid(page, "mk.lv.a8") === '"1000"', "the new level is saved for age 8");
  const rec = JSON.parse(await kid(page, "loopy.levels"))["make-10"];
  check(rec && rec[0] === 4 && rec[1] === 3 && rec[3] === 8, "the record says level 5, from level 4, at age 8: " + JSON.stringify(rec));
  check(JSON.stringify(JSON.parse(await kid(page, "loopy.recent"))["make-10"] || []) === "[]", "the Last 5 starts afresh on the new level");
  await page.locator(".loopy-cheer.big button", { hasText: "Back a step" }).click();
  await page.waitForTimeout(300);
  check((await level(page)).startsWith("Level 4 of 5") && await kid(page, "mk.lv.a8") === '"100"', "Back a step goes back to level 4 and saves it");
  check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.join("; ") : ""));
  await ctx.close();
}

console.log("2. 10 in a row");
{
  // A child with the streak badges already: the tenth right answer in a row moves the level up.
  const { ctx, page, errors } = await open("math/make-10/", { "mk.lv.a8": '"10"', "loopy.rewards": JSON.stringify({ stars: 60, best: { "make-10": 12 }, played: ["make-10"], brave: false }) });
  for (let i = 0; i < 10; i++) {
    await right(page);
    if (i < 9) {
      check(await cheer(page).count() === 0 || !/Level up/.test(await cheer(page).innerText()), `no level up after ${i + 1} right`);
      const big = page.locator(".loopy-cheer.big button");
      if (await big.count()) { await big.first().click(); await page.waitForTimeout(200); }
      await page.click("#k-go");
      await page.waitForTimeout(100);
    }
  }
  const text = await cheer(page).count() ? await cheer(page).innerText() : "";
  check(/Level up/.test(text) && /10 in a row/.test(text), "after 10 in a row the card says Level up, 10 in a row: " + JSON.stringify(text));
  check((await level(page)).startsWith("Level 2 of 5"), "the level is 2 now");
  check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.join("; ") : ""));
  await ctx.close();

  // A new child: the tenth answer brings a badge card instead, so the level up comes with the next right answer.
  // (Two badges come at 10: First Steps for 10 stars and Hot Streak for 10 in a row, one card per answer.)
  const n = await open("math/make-10/", { "mk.lv.a8": '"10"' });
  let upAt = 0;
  for (let i = 0; i < 13 && !upAt; i++) {
    await right(n.page);
    if (i === 9) check(/New badge/.test(await cheer(n.page).innerText()) && (await level(n.page)).startsWith("Level 1 of 5"), "a badge at the tenth answer comes first, the level waits");
    if (await cheer(n.page).count() && /Level up/.test(await cheer(n.page).innerText())) upAt = i + 1;
    const big = n.page.locator(".loopy-cheer.big button");
    if (await big.count()) { await big.first().click(); await n.page.waitForTimeout(200); }
    await n.page.click("#k-go");
    await n.page.waitForTimeout(100);
  }
  check(upAt === 12 && (await level(n.page)).startsWith("Level 2 of 5"), "the level goes up right after the badge cards, with answer " + upAt);
  await n.ctx.close();
}

console.log("3. Birthday");
{
  const rec = JSON.stringify({ "make-10": [4, 3, "2026-10-01", 8] });
  const { ctx, page, errors } = await open("math/make-10/", { "mk.lv.a8": '"1000"', "loopy.levels": rec, "loopy.ageOffset": "1", "loopy.recent": JSON.stringify({ "make-10": [1, 1, 0] }) });
  await page.waitForTimeout(300);
  check((await level(page)).startsWith("Level 5 of 5"), "at age 9 the child is still on level 5: " + await level(page));
  check(await kid(page, "mk.lv.a9") === '"1000"', "the level is saved for age 9");
  const r = JSON.parse(await kid(page, "loopy.levels"))["make-10"];
  check(r && r[0] === 4 && r[1] === 3 && r[2] === "2026-10-01" && r[3] === 9, "the record keeps its history and now says age 9: " + JSON.stringify(r));
  check(JSON.stringify(JSON.parse(await kid(page, "loopy.recent"))["make-10"]) === "[1,1,0]", "the Last 5 is kept, a carry-over is not a level change");
  check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.join("; ") : ""));
  await ctx.close();

  // The grown-ups' levels list says the same, even before the game is opened.
  const g = await open("progress/", { "mk.lv.a8": '"1000"', "loopy.levels": rec, "loopy.ageOffset": "1" });
  await g.page.waitForTimeout(500);
  const lv = await g.page.evaluate(() => Loopy.levelOf("make-10"));
  check(lv && lv.at === 4, "Loopy.levelOf gives level 5 at age 9: " + JSON.stringify(lv));
  await g.ctx.close();

  // A record from before, with no age, carries nothing: the age's own start level is used.
  const o = await open("math/make-10/", { "mk.lv.a8": '"1000"', "loopy.levels": JSON.stringify({ "make-10": [4, 3, "2026-10-01"] }), "loopy.ageOffset": "1" });
  await o.page.waitForTimeout(300);
  check((await level(o.page)).startsWith("Level 4 of 5"), "an old record without an age does not carry: " + await level(o.page));
  await o.ctx.close();

  // A younger age by hand does not carry a higher level down: age 7 starts at its own level.
  const y = await open("math/make-10/", { "loopy.levels": JSON.stringify({ "make-10": [4, 3, "2026-10-01", 8] }), "loopy.ageOffset": "-1" });
  await y.page.waitForTimeout(300);
  check((await level(y.page)).startsWith("Level 2 of 5"), "age 7 by hand starts at its own level: " + await level(y.page));
  await y.ctx.close();
}

console.log("4. Last 5 pill");
{
  const { ctx, page } = await open("math/make-10/", { "loopy.recent": JSON.stringify({ "make-10": [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1] }) });
  check(await page.locator("#last5 i").count() === 5, "five dots at most");
  check(/: 5 right/.test(await page.locator("#last5").getAttribute("aria-label")), "the dots count the last five only: " + await page.locator("#last5").getAttribute("aria-label"));
  check((await page.evaluate(() => Loopy.recent.get("make-10"))).length === 12, "all 12 answers are kept");
  await ctx.close();
  const s = await open("math/times-sprint/", { "tt.lv.a8": "1" });
  await s.page.waitForTimeout(300);
  await s.page.evaluate(() => Loopy.levels.offer("harder"));
  await s.page.waitForTimeout(300);
  check(await cheer(s.page).count() === 1 && /Level up/.test(await cheer(s.page).innerText()) && (await level(s.page)).startsWith("Level 3"), "Times Tables Sprint goes up after a clean round");
  await s.ctx.close();
}

console.log("5. Today's 10 at the child's levels");
{
  // Plus and Minus on level 5 (to 1,000 with carrying) and Times and Share on level 5 (all tables to 12) at age 8.
  const { ctx, page, errors } = await open("mix/daily-mix/", { "pm100.max.a8": "1000", "pm100.rg.a8": '"yes"', "ts.lv.a8": "4" });
  await page.waitForTimeout(500);
  const chips = [], sums = [];
  for (let i = 0; i < 10; i++) {
    chips.push(await page.locator("#kind").innerText());
    sums.push((await page.locator("#stage").innerText()).replace(/\s+/g, " "));
    await page.locator("#choices button").first().click(); await page.waitForTimeout(80);
    const big = page.locator(".loopy-cheer.big button"); if (await big.count()) await big.first().click();
    if (i < 9) { await page.click("#next"); await page.waitForTimeout(80); }
  }
  const pm = chips.map((c, i) => [c, sums[i]]).filter(x => /Plus and Minus/i.test(x[0]));
  check(pm.length > 0 && pm.every(x => /Level 5\/7/i.test(x[0])), "Plus and Minus problems say Level 5/7: " + pm.map(x => x[0]).join(", "));
  check(pm.some(x => /\d{3}/.test(x[1])), "the sums have three-digit numbers: " + pm.map(x => x[1]).join(" | "));
  const ts = chips.filter(c => /Times and Share/i.test(c));
  check(ts.length > 0 && ts.every(c => /Level 5\/7/i.test(c)), "Times and Share problems say Level 5/7");
  check(chips.filter(c => /What Time/i.test(c)).every(c => /Level 3\/5/i.test(c)), "What Time Is It? stays at the age's level 3/5");
  check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.join("; ") : ""));
  await ctx.close();
}

await browser.close();
server.close();
console.log(problems.length ? `\n${problems.length} problem(s)` : "\nAll good.");
process.exit(problems.length ? 1 : 0);
