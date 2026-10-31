// End-to-end test for Try again: in every game, a wrong answer comes back and goes away once it is answered right twice.
// See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the play test)
//   node tools/e2e/retry.mjs                      (exit code 1 if anything fails; GAME=plus-minus for one game)
//
// For each game (Today's 10 only logs, so it is checked through Plus and Minus), at age 8 in English:
//   1. Answer wrong on purpose. The answer log's new row must carry a rebuild note (r).
//   2. Open the game again with #retry. The first question must be the one that was missed.
//   3. Answer it right. Open with #retry again: it must still come first (fixed once). Answer it right again.
//      Open with #retry a third time: it must not come first any more, and Loopy.retry.list() must not have it.
//   Games where the right answer cannot be typed from the log (money, letters) stop after step 2 and say so.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");

const GAMES = [], ONLY = process.env.GAME || "";
for (const subject of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, subject);
  if (!fs.statSync(dir).isDirectory() || /^[._]|^(docs|fonts|tools|src|help|progress|node_modules|mix|guide-src)$/.test(subject)) continue;
  for (const game of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, game, "index.html");
    if (`${subject}/${game}/`.includes(ONLY) && fs.existsSync(file) && !/http-equiv="refresh"|location\.replace/.test(fs.readFileSync(file, "utf8"))) GAMES.push(`${subject}/${game}/`);
  }
}

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
const problems = [], rows = [];

async function open(game, fail) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
  await ctx.addInitScript(() => {
    if (!localStorage.getItem("loopy.e2e")) {
      localStorage.setItem("loopy.e2e", "1");
      localStorage.setItem("loopy.lang", "en"); localStorage.setItem("loopy.sound", "off"); localStorage.setItem("loopy.readAloud", "off");
    }
    window.__questions = [];
    new MutationObserver(list => list.forEach(m => window.__questions.push(m.target.getAttribute("data-q"))))
      .observe(document, { subtree: true, attributeFilter: ["data-q"] });
  });
  ctx.setDefaultTimeout(5000);
  const p = await ctx.newPage();
  p.on("pageerror", e => fail(`script error: ${e.message}`));
  p.on("console", m => { if (m.type() === "error") fail(`console error: ${m.text()}`); });
  await p.goto(BASE + game);
  await p.evaluate(() => Loopy.setAge(8));
  await p.reload();
  await p.waitForFunction(() => window.__questions.length > 0);
  return p;
}

const asked = p => p.evaluate(() => window.__questions.length);
// Open the game again from the Try again card. (A hash alone does not reload the page, so reload after it.)
async function openRetry(p, game) {
  await p.goto(BASE + game + "#retry");
  await p.reload();
  await p.waitForFunction(() => window.__questions.length > 0);
}
const lastAnswer = p => p.evaluate(() => Loopy.rewards.last());
const firstKey = p => p.evaluate(() => window.__questions[0]);

// A sum in steps (Box Multiplication): the card says data-steps="on" until every box and the total are done.
// The box being filled carries its answer in data-a, the way choice games mark the right one with data-correct.
async function steps(p) {
  for (let i = 0; i < 40 && await p.locator('[data-steps="on"]').count(); i++) {
    const a = await p.locator("[data-a]").first().getAttribute("data-a");
    for (const ch of a) await p.click(`#pad [data-d="${ch}"]`);
    await p.click("#k-go");
  }
}

async function closeCheer(p) {
  const big = p.locator(".loopy-cheer.big button");
  if (await big.count()) { await big.last().click(); await p.waitForTimeout(300); }
}
async function next(p, n) {
  await closeCheer(p);
  // A sum in steps that was missed is finished first, so Check turns into Next.
  await steps(p);
  await closeCheer(p);
  if (await asked(p) > n) return;
  for (const id of ["#next", "#k-go"]) {
    const b = p.locator(id);
    if (await b.count() && await b.isVisible() && await b.isEnabled()) { await b.click(); break; }
  }
  // A round of several questions ends with a summary (Word Detective's case file): Next once more goes on.
  try { await p.waitForFunction(k => window.__questions.length > k, n, { timeout: 1500 }); }
  catch (e) { const b = p.locator("#next"); if (await b.count() && await b.isVisible() && await b.isEnabled()) await b.click(); }
  await p.waitForFunction(k => window.__questions.length > k, n, { timeout: 5000 });
}

// Answer wrong on purpose: a choice or word that is not marked right, a wrong digit, a tap beside the place.
async function answerWrong(p) {
  const wrong = p.locator('#choices button:enabled:not([data-correct="true"]), #answers button:enabled:not([data-correct="true"]), #words button:enabled:not([data-correct="true"])');
  if (await wrong.count()) {
    await wrong.first().click();
    const go = p.locator("#k-go");
    if (await go.count() && await go.isVisible()) {
      const any = p.locator("#words button:enabled");
      for (let i = 0; i < 12 && await go.isDisabled() && await any.count(); i++) await any.first().click();
      if (await go.isEnabled()) await go.click();
    }
    return;
  }
  // A word guessed in several tries: a letter that is not in the word, in every box, until the tries run out.
  if (await p.locator('[data-tries="on"]').count()) {
    for (let i = 0; i < 6 && await p.locator('[data-tries="on"]').count(); i++) {
      const a = await p.locator('[data-tries="on"]').first().getAttribute("data-a");
      const keys = await p.locator("button[data-k]").evaluateAll(list => list.map(b => b.dataset.k));
      const k = keys.find(c => !a.includes(c));
      for (let j = 0; j < a.length; j++) await p.click(`[data-k="${k}"]`);
      await p.click("#k-go");
    }
    return;
  }
  if (await p.locator("#pad, #letters").count()) {
    const key = p.locator("#pad button:enabled:not(#k-go):not(#k-erase), #letters button:enabled");
    for (let i = 0; i < 12 && await p.locator("#k-go").isDisabled(); i++) await key.last().click();
    await p.click("#k-go");
    return;
  }
  const place = p.locator('#map [role="button"]');
  if (await place.count()) await place.last().dispatchEvent("click");
  else await p.locator("#map").click({ position: { x: 5, y: 5 } });
}

// Miss the question on screen and wait until the answer counts: a new wrong row in the log, or a star.
// A tap that only puts one number in order counts as nothing yet, so it taps again. Returns true when
// the answer was wrong, false when the guess happened to be right, null when nothing counted.
async function miss(p) {
  const state = () => p.evaluate(() => [Loopy.log.get().wrong.length, +document.querySelector("[data-loopy-stars]").textContent]);
  const [w0, s0] = await state();
  for (let t = 0; t < 4; t++) {
    await answerWrong(p);
    try {
      await p.waitForFunction(([w, s]) => Loopy.log.get().wrong.length > w || +document.querySelector("[data-loopy-stars]").textContent > s, [w0, s0], { timeout: 1500 });
    } catch (e) { continue; }
    return (await state())[0] > w0;
  }
  return null;
}

// Answer right: the marked choice, or the logged right answer typed on the pad. Returns false when it cannot.
async function answerRight(p, row) {
  if (await p.locator('[data-steps="on"]').count()) { await steps(p); return true; }
  const right = p.locator('[data-correct="true"]:enabled');
  if (await right.count()) {
    await right.first().click();
    const go = p.locator("#k-go");
    if (await go.count() && await go.isDisabled()) {
      for (let i = 0; i < 12 && await go.isDisabled() && await right.count(); i++) await right.first().click();
      await go.click();
    }
    return true;
  }
  if (await p.locator('[data-tries="on"]').count()) {
    for (const ch of row.a.toLowerCase()) await p.click(`[data-k="${ch}"]`);
    await p.click("#k-go");
    return true;
  }
  if (await p.locator("#pad").count()) {
    const digits = row.a.replace(/[^\d]/g, "");
    if (!digits || row.a.replace(/[\d.,\s]/g, "")) return false;
    for (const d of digits) {
      const b = p.locator("#pad button:enabled", { hasText: new RegExp("^" + d + "$") });
      if (!await b.count()) { if (process.env.DEBUG) console.error("no key", d, await p.locator("#pad button").count()); return false; }
      await b.first().click();
    }
    if (await p.locator("#k-go").isDisabled()) { if (process.env.DEBUG) console.error("go disabled"); return false; }
    await p.click("#k-go");
    return true;
  }
  if (await p.locator("#letters").count()) {
    for (const ch of row.a) {
      const b = p.locator("#letters button:enabled", { hasText: new RegExp("^" + ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") });
      if (!await b.count()) return false;
      await b.first().click();
    }
    if (await p.locator("#k-go").isDisabled()) return false;
    await p.click("#k-go");
    return true;
  }
  return false;
}

for (const game of GAMES) {
  const fail = what => problems.push(`${game}: ${what}`);
  let p, note = "-", replay = "-", fixed = "-";
  try {
    p = await open(game, fail);
    // 1. Miss a question (up to 12 tries, in case a guess happens to be right). Not the first one, so that
    //    "comes back first" means the newest mistake and not just the game's first question.
    let row = null, missedKey = "";
    await miss(p);
    await next(p, 1);
    for (let i = 0; i < 12 && !row; i++) {
      const n = await asked(p);
      // The key is read before answering: a sprint game shows the next question by itself after an answer.
      const key = await p.evaluate(() => window.__questions[window.__questions.length - 1]);
      if (await miss(p)) {
        row = await p.evaluate(() => Loopy.log.get().wrong.slice(-1)[0] || null);
        missedKey = key;
      } else await next(p, n);
    }
    if (process.env.DEBUG) console.error("row", JSON.stringify(row), missedKey);
    if (!row) { fail("could not answer wrong"); note = "no miss"; }
    else if (!row.r) { fail("the wrong answer was logged without a rebuild note (r)"); note = "missing"; }
    else {
      note = "ok";
      const listed = await p.evaluate(() => Loopy.retry.list().length);
      if (!listed) fail("Loopy.retry.list() is empty after a wrong answer with a note");
      // 2. Open again with #retry: the missed question comes first.
      await openRetry(p, game);
      const k1 = await firstKey(p);
      if (k1 !== missedKey) { fail(`opened with #retry, the first question is "${k1}", not the missed "${missedKey}"`); replay = "wrong"; }
      else {
        replay = "ok";
        // 3. Right twice, then it is gone.
        if (!await answerRight(p, row)) fixed = "not typed";
        else {
          await p.waitForFunction(() => Loopy.rewards.last() !== null);
          const ok1 = await lastAnswer(p);
          if (!ok1.ok) { fail(`the logged right answer "${row.a}" was not accepted`); fixed = "rejected"; }
          else {
            const f1 = await p.evaluate(r => (Loopy.log.get().wrong.filter(w => w.r === r).pop() || {}).f, row.r);
            if (f1 !== 1) fail(`after one right answer the row's fixed count is ${f1}, not 1`);
            await openRetry(p, game);
            if (await firstKey(p) !== missedKey) fail("after one right answer the mistake no longer comes first with #retry");
            if (!await answerRight(p, row)) fixed = "not typed";
            else {
              await p.waitForFunction(() => Loopy.rewards.last() !== null);
              await openRetry(p, game);
              const left = await p.evaluate(r => Loopy.retry.list().some(x => x.r === r), row.r);
              if (left) { fail("still on Loopy.retry.list() after two right answers"); fixed = "stays"; }
              else if (await firstKey(p) === missedKey) { fail("comes first with #retry after two right answers"); fixed = "stays"; }
              else fixed = "ok";
            }
          }
        }
      }
    }
    rows.push(`| ${game} | ${note} | ${replay} | ${fixed} |`);
  } catch (e) {
    fail(`could not play: ${e.message.split("\n")[0]}`);
    rows.push(`| ${game} | ${note} | ${replay} | error |`);
  }
  if (p) await p.context().close();
  console.error(`${game}: ${problems.length ? problems.length + " problem(s) so far" : "ok"} (${Math.round(performance.now() / 1000)}s)`);
}

await browser.close();
server.close();

console.log("| Game | Note logged | Comes back first | Gone after 2 right |\n|---|---|---|---|");
console.log(rows.join("\n"));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const x of problems) console.log("  " + x);
  process.exit(1);
}
console.log("\nNo problems found.");
