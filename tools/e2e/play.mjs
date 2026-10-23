// End-to-end test: play every loopy game in Chrome and check that no question comes back too soon.
// See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the accessibility check)
//   node tools/e2e/play.mjs                       (exit code 1 if anything fails)
//
// The site is served under /loopy/, like GitHub Pages. For each game, at three ages, it answers
// 30 questions (Today's 10: one set of 10) and checks:
//   1. No script errors, no console errors, nothing fails to load, nothing loads from another website.
//   2. Every question is answered and the next one comes.
//   3. The star counter goes up by exactly the number of right answers.
//   4. No repeats. Each game puts the key of the question on screen on <body data-q> (Loopy.fresh does it).
//      The same question may not come back within the next 10. If a game has fewer than 11 questions
//      at that level, they must go round: every one of them before any comes back.
//      In Today's 10, all ten are different.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");

const ROUNDS = 30, WINDOW = 10;
const RUNS = [{ age: 5, lang: "en" }, { age: 8, lang: "de" }, { age: 16, lang: "en" }];

// Every <subject>/<game>/index.html, except old addresses that only forward to a new one.
const GAMES = [], ONLY = process.env.GAME || ""; // GAME=plus-minus plays just that one
for (const subject of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, subject);
  if (!fs.statSync(dir).isDirectory() || /^[._]|^(docs|fonts|tools|src|help|progress|node_modules|guide-src)$/.test(subject)) continue;
  for (const game of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, game, "index.html");
    if (`${subject}/${game}/`.includes(ONLY) && fs.existsSync(file) && !/http-equiv="refresh"|location\.replace/.test(fs.readFileSync(file, "utf8"))) GAMES.push(`${subject}/${game}/`);
  }
}

// SHARD=1/2 checks only the first half of the games (every other one), SHARD=2/2 the rest. CI runs both at once.
const [SHARD, SHARDS] = (process.env.SHARD || "1/1").split("/").map(Number);
if (!(SHARDS >= 1 && SHARD >= 1 && SHARD <= SHARDS)) throw new Error(`SHARD must look like 1/2, not ${process.env.SHARD}`);
const mine = (_, i) => i % SHARDS === SHARD - 1;
GAMES.splice(0, GAMES.length, ...GAMES.filter(mine));

// The site at /loopy/, the way GitHub Pages serves it.
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
const ORIGIN = `http://127.0.0.1:${server.address().port}`, BASE = ORIGIN + "/loopy/";

// Chrome on GitHub's runners, the pre-installed Chromium in Claude's cloud, or CHROME=/path/to/chrome.
async function launch() {
  const tries = [];
  if (process.env.CHROME) tries.push({ executablePath: process.env.CHROME });
  for (const p of ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"])
    if (fs.existsSync(p)) tries.push({ executablePath: p });
  tries.push({ channel: "chrome" });
  for (const t of tries) { try { return await chromium.launch(t); } catch (e) { /* try the next one */ } }
  throw new Error("No Chrome or Chromium found. Set CHROME=/path/to/chrome.");
}
const browser = await launch();

const problems = [];
const rows = [];

// Open a game as a child of this age, in this language, with sound and Read aloud off.
async function open(game, { age, lang }, fail) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
  await ctx.addInitScript((l) => {
    if (!localStorage.getItem("loopy.e2e")) {
      localStorage.setItem("loopy.e2e", "1");
      localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off"); localStorage.setItem("loopy.readAloud", "off");
    }
    // Every question the game shows, in order, even the same one twice. A level change is a null mark: the game
    // forgets what it asked when the level changes, so the repeat check starts afresh there.
    // (The level pill is read when the question arrives, so a question made by the level change itself counts as new-level.)
    window.__questions = [];
    let level = "";
    new MutationObserver(list => list.forEach(m => {
      const el = document.getElementById("level"), now = el ? el.textContent : "";
      if (now !== level) { if (level) window.__questions.push(null); level = now; }
      window.__questions.push(m.target.getAttribute("data-q"));
    })).observe(document, { subtree: true, attributeFilter: ["data-q"] });
  }, lang);
  ctx.setDefaultTimeout(5000);
  const p = await ctx.newPage();
  p.on("pageerror", e => fail(`script error: ${e.message}`));
  p.on("console", m => { if (m.type() === "error") fail(`console error: ${m.text()}`); });
  p.on("request", r => { if (!r.url().startsWith(ORIGIN) && !/^(data|blob):/.test(r.url())) fail(`loads from another website: ${r.url()}`); });
  // (Leaving the page cancels what is still loading; that is not a failure.)
  p.on("requestfailed", r => { if (r.failure().errorText !== "net::ERR_ABORTED") fail(`could not load ${r.url()}`); });
  await p.goto(BASE + game);
  // Set the age the way a parent does, then start again so the first question is at that age too.
  await p.evaluate(a => Loopy.setAge(a), age);
  await p.reload();
  await p.waitForFunction(() => window.__questions.length > 0);
  return p;
}

const stars = p => p.evaluate(() => +document.querySelector("[data-loopy-stars]").textContent);
const score = p => p.evaluate(() => { const s = document.getElementById("score"); return s ? s.textContent.split("/").map(n => +n.replace(/\D/g, "")) : null; });
const asked = p => p.evaluate(() => window.__questions.length);

// A sum in steps (Box Multiplication): the card says data-steps="on" until every box and the total are done.
// The box being filled carries its answer in data-a, the way choice games mark the right one with data-correct.
async function steps(p) {
  for (let i = 0; i < 40 && await p.locator('[data-steps="on"]').count(); i++) {
    const a = await p.locator("[data-a]").first().getAttribute("data-a");
    for (const ch of a) await p.click(`#pad [data-d="${ch}"]`);
    await p.click("#k-go");
  }
}

// Answer the question on screen: the right answer when the page marks it, otherwise the first one.
// Returns true when the answer was the marked right one.
async function answer(p) {
  if (await p.locator('[data-steps="on"]').count()) { await steps(p); return true; }
  const right = p.locator('[data-correct="true"]:enabled');
  if (await right.count()) {
    await right.first().click();
    // A sentence is built word by word: keep tapping the marked word until Check turns on, then Check.
    const go = p.locator("#k-go");
    if (await go.count() && await go.isDisabled()) {
      for (let i = 0; i < 12 && await go.isDisabled() && await right.count(); i++) await right.first().click();
      await go.click();
    }
    return true;
  }
  if (await p.locator("#pad, #letters").count()) {
    // Number and letter pads: type with the first key until Check turns on.
    const key = p.locator("#pad button:enabled:not(#k-go):not(#k-erase), #letters button:enabled");
    for (let i = 0; i < 12 && await p.locator("#k-go").isDisabled(); i++) await key.first().click();
    await p.click("#k-go");
    return false;
  }
  // Choices, or places on the map. "Put in order" needs a tap on each number, so keep tapping until it is answered.
  const before = await score(p);
  for (let i = 0; i < 6; i++) {
    const pick = p.locator("#choices button:enabled, #answers button:enabled");
    const place = p.locator('#map [role="button"]');
    if (await pick.count()) await pick.first().click();
    // A place can be smaller than a finger (or covered by a bigger one), so it gets the click straight away.
    else if (await place.count()) await place.first().dispatchEvent("click");
    else await p.locator("#map").click();
    const now = await score(p);
    if (!before || now[1] > before[1]) break;
  }
  return false;
}

// Close a big window: a badge card with its button, a "Level up! ⬆" card with "Yay!", so the game goes on at
// the new level, as it would for a child.
async function closeCheer(p) {
  const big = p.locator(".loopy-cheer.big");
  if (!await big.count()) return;
  const up = (await big.innerText()).includes("\u2b06");
  await big.locator("button")[up ? "first" : "last"]().click();
  await p.waitForTimeout(300);
}

// Go to the next question: Next, or Check that has turned into Next. n is how many questions
// were asked before this answer; a game that already moved on needs no tap.
async function next(p, n) {
  await closeCheer(p);
  if (await asked(p) > n) return;
  for (const id of ["#next", "#k-go"]) {
    const b = p.locator(id);
    if (await b.count() && await b.isVisible() && await b.isEnabled()) { await b.click(); break; }
  }
  await p.waitForFunction(k => window.__questions.length > k, n, { timeout: 5000 });
}

// The same question may not come back within WINDOW questions, or, for a smaller game, before all the others.
function repeats(keys, whole) {
  const out = [], parts = [[]];
  for (const k of keys) k === "\x00" ? parts.push([]) : parts[parts.length - 1].push(k);
  for (const part of parts) {
    const w = whole ? part.length : Math.min(WINDOW, new Set(part).size - 1);
    part.forEach((k, i) => { const j = i ? part.lastIndexOf(k, i - 1) : -1; if (j >= 0 && i - j <= w) out.push(`"${k}" again after ${i - j}`); });
  }
  return out;
}

for (const game of GAMES) {
  const daily = game.startsWith("mix/");
  for (const run of RUNS) {
    const where = `${game} [age ${run.age}, ${run.lang}]`;
    const fail = what => problems.push(`${where}: ${what}`);
    let p;
    try {
      p = await open(game, run, fail);
      const rounds = daily ? 10 : ROUNDS, starsBefore = await stars(p);
      let marked = 0;
      for (let i = 0; i < rounds; i++) {
        // Counted before answering: a sprint game shows the next question by itself after Check.
        const n = await asked(p);
        if (await answer(p)) marked++;
        if (i < rounds - 1) await next(p, n);
        else await closeCheer(p);
      }
      const keys = await p.evaluate(() => window.__questions.map(k => k === null ? "\x00" : k));
      const sc = await score(p), gained = (await stars(p)) - starsBefore;
      const rightCount = sc ? sc[0] : marked;
      if (sc && sc[1] !== rounds) fail(`the score says ${sc[1]} answered, not ${rounds}`);
      if (gained !== rightCount) fail(`${rightCount} right answers but the star counter went up by ${gained}`);
      const bad = repeats(keys, daily);
      for (const b of bad) fail(`question repeated too soon: ${b}`);
      const qs = keys.filter(k => k !== "\x00");
      rows.push(`| ${game} | ${run.age} | ${run.lang} | ${qs.length} | ${new Set(qs).size} | ${rightCount} | ${bad.length ? "repeats" : "pass"} |`);
    } catch (e) {
      fail(`could not play: ${e.message.split("\n")[0]}`);
      rows.push(`| ${game} | ${run.age} | ${run.lang} | - | - | - | error |`);
    }
    if (p) await p.context().close();
    console.error(`${where}: ${problems.length ? problems.length + " problem(s) so far" : "ok"} (${Math.round(performance.now() / 1000)}s)`);
  }
}

await browser.close();
server.close();

if (SHARDS > 1) console.log(`Part ${SHARD} of ${SHARDS}.\n`);
console.log("| Game | Age | Language | Questions | Different | Right (stars) | Result |\n|---|---|---|---|---|---|---|");
console.log(rows.join("\n"));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const x of problems) console.log("  " + x);
  process.exit(1);
}
console.log("\nNo problems found.");
