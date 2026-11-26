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
import { launch, ENGINE, body } from "./engine.mjs";

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
  res.end(body(file));
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`, BASE = ORIGIN + "/loopy/";

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

// A word guessed in several tries (Word Detective): the card says data-tries="on" until the word is found or
// the tries run out, and carries the word in data-a. The keys carry their letter in data-k.
async function tries(p) {
  const a = await p.locator('[data-tries="on"]').first().getAttribute("data-a");
  for (const ch of a) await p.click(`[data-k="${ch}"]`);
  await p.click("#k-go");
}

// A word traced through a letter grid (Word Trail): the card says data-trail="on" while a word is wanted and carries
// its boxes in data-a as "row-col" pairs. The boxes carry data-rc. The word counts as soon as its last box is tapped.
async function trail(p) {
  const a = await p.locator('[data-trail="on"]').first().getAttribute("data-a");
  for (const rc of a.split(",")) await p.click(`#grid [data-rc="${rc}"]`);
}

// A chess move or puzzle (Chess Puzzles): the card says data-chess="on" while a move is wanted and carries the
// child's moves in data-a as "e2e4,g1f3" (a fifth letter picks the piece a pawn becomes). The squares carry data-sq.
// data-wait="on" while the other side moves; the board takes no taps then.
async function chess(p) {
  const on = '[data-chess="on"]', ready = () => p.waitForFunction(() => {
    const c = document.querySelector("[data-chess]"); return c.dataset.chess !== "on" || c.dataset.wait !== "on";
  }, null, { timeout: 5000 });
  await ready();
  await p.evaluate(() => { window.__cpBefore = Loopy.rewards.last(); });
  for (const u of (await p.locator(on).first().getAttribute("data-a")).split(",")) {
    if (!await p.locator(on).count()) break;
    await p.click(`#board [data-sq="${u.slice(0, 2)}"]`);
    await p.click(`#board [data-sq="${u.slice(2, 4)}"]`);
    if (u[4]) await p.click(`[data-promo="${u[4]}"]`);
    await ready();
  }
  // The puzzle's own moves must count as right (a level-up may already show the next card, so ask loopy).
  if (!await p.evaluate(() => { const l = Loopy.rewards.last(); return !!l && l !== window.__cpBefore && l.ok; })) throw new Error("chess: the puzzle's own moves were not marked right");
}

// Answer the question on screen: the right answer when the page marks it, otherwise the first one.
// Returns true when the answer was the marked right one.
async function answer(p) {
  if (await p.locator('[data-steps="on"]').count()) { await steps(p); return true; }
  if (await p.locator('[data-tries="on"]').count()) { await tries(p); return true; }
  if (await p.locator('[data-trail="on"]').count()) { await trail(p); return true; }
  if (await p.locator('[data-chess="on"]').count()) { await chess(p); return true; }
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
  // A round of several questions ends with a summary (Word Detective's case file): Next once more goes on.
  try { await p.waitForFunction(k => window.__questions.length > k, n, { timeout: 1500 }); }
  catch (e) { const b = p.locator("#next"); if (await b.count() && await b.isVisible() && await b.isEnabled()) await b.click(); }
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

// Word games: the words follow loopy's language. A "Words in" pick saved before the fix, or one made under the other
// loopy language, must not keep the words in the other language. A pick made under this loopy language holds.
const WORDS_IN = { "languages/my-words/": "mw", "languages/sentence-builder/": "sb", "languages/sound-spell/": "ss", "languages/spell-it/": "si",
  "languages/spelling-quiz/": "sq", "languages/word-detective/": "wd", "languages/word-match/": "wm", "languages/word-trail/": "wt" };
async function wordsFollowLanguage(game, run, fail) {
  const key = WORDS_IN[game], other = run.lang === "de" ? "en" : "de";
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
  await ctx.addInitScript(([l, k, o]) => {
    if (localStorage.getItem("loopy.e2e")) return;
    localStorage.setItem("loopy.e2e", "1"); localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off"); localStorage.setItem("loopy.readAloud", "off");
    localStorage.setItem("loopy.kid.1." + k + ".words", JSON.stringify(o));
  }, [run.lang, key, other]);
  const p = await ctx.newPage();
  p.on("pageerror", e => fail(`script error: ${e.message}`));
  const pick = async () => { await p.waitForSelector('#words-seg [aria-pressed="true"]', { state: "attached" }); return p.evaluate(() => document.querySelector('#words-seg [aria-pressed="true"]').dataset.words); };
  await p.goto(BASE + game);
  if (await pick() !== run.lang) fail(`words saved as ${other} before the fix still win over loopy's language ${run.lang}`);
  await p.evaluate(([l, k, o]) => { localStorage.setItem("loopy.kid.1." + k + ".words", JSON.stringify(o)); localStorage.setItem("loopy.kid.1." + k + ".wordsUi", JSON.stringify(l)); }, [run.lang, key, other]);
  await p.reload();
  if (await pick() !== other) fail(`a "Words in" pick of ${other} made under loopy's language ${run.lang} did not hold`);
  await ctx.close();
}

// Money on screen (Class Test, Is It Enough?): every note and coin carries its € sign, so a note does not look like a
// plain number card, and Class Test's hint speaks of coins only when there are some (issue #272).
async function money(p, fail, game) {
  const m = await p.evaluate(() => {
    const m = document.querySelector(".money"); if (!m) return null;
    const hint = document.querySelector("#question small, .question small");
    return { plain: [...m.children].filter(i => !i.textContent.includes("€")).map(i => i.textContent), coins: !!m.querySelector(".coin"), notes: !!m.querySelector(".note"), hint: hint ? hint.textContent : "" };
  });
  if (!m) return;
  if (m.plain.length) fail(`money without its € sign: ${m.plain.join(", ")}`);
  const says = /coins|Münzen/.test(m.hint) && /then|dann/.test(m.hint);
  if (game.includes("class-test") && says && !(m.coins && m.notes)) fail(`the hint "${m.hint}" speaks of notes and coins, but the screen shows ${m.coins ? "only coins" : "only notes"}`);
}

// Class Test reaches its money task (task 9) only after the 10 rounds played here, so the task is put first through
// Try again: four notes and no coins, the case in issue #272. The hint must then say so, and every note its € sign.
async function classTestMoney(run, fail) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
  await ctx.addInitScript((l) => {
    if (localStorage.getItem("loopy.e2e")) return;
    localStorage.setItem("loopy.e2e", "1"); localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off");
    const day = new Date().toISOString().slice(0, 10);
    localStorage.setItem("loopy.kid.1.loopy.log", JSON.stringify({ days: {}, wrong: [{ d: day, g: "class-test", q: "How much money?: 50 + 20 + 10 + 5", a: "85", y: "95", k: "em-count", r: "ct:9:50,20,10,5" }] }));
  }, run.lang);
  const p = await ctx.newPage();
  p.on("pageerror", e => fail(`script error: ${e.message}`));
  await p.goto(BASE + "mix/class-test/#retry");
  await p.waitForFunction(() => document.querySelector(".money"), null, { timeout: 5000 }).catch(() => fail("Try again did not put the money task first"));
  await money(p, fail, "mix/class-test/");
  await ctx.close();
}

// Is It Enough? on a phone whose keys leave a short card (issue #310: at 426×828 the "?" box and the kind tag were cut
// off): the fullest problems are put first through Try again, and every part of the card must be inside it, fresh and
// after a wrong answer with the explanation, on the phone from the report and on the smallest one.
async function enoughMoneyFits(run, fail) {
  const NOTES = ["5:s:9:27-4,21-20,32-24:12:20,5,5,5,1:-:d", "5:s:9:12-45,36-12,28-30:012:50,20,10,5,2,1,1:-:yn"];
  for (const [width, height] of [[426, 828], [360, 640]]) for (const note of NOTES) {
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce", serviceWorkers: "block" });
    await ctx.addInitScript(([l, r]) => {
      if (localStorage.getItem("loopy.e2e")) return;
      localStorage.setItem("loopy.e2e", "1"); localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off"); localStorage.setItem("loopy.readAloud", "off");
      localStorage.setItem("loopy.hint.enough-money", "1"); localStorage.setItem("loopy.kid.1.loopy.ageOffset", "2");
      localStorage.setItem("loopy.kid.1.loopy.log", JSON.stringify({ days: {}, wrong: [{ d: new Date().toISOString().slice(0, 10), g: "enough-money", q: "?", a: "1", y: "2", k: "em-diff", r }] }));
    }, [run.lang, note]);
    const p = await ctx.newPage();
    p.on("pageerror", e => fail(`script error: ${e.message}`));
    await p.goto(BASE + "math/enough-money/#retry");
    await p.waitForFunction(r => document.body.getAttribute("data-q") === r, note, { timeout: 5000 }).catch(() => fail(`Try again did not put the problem ${note} first`));
    const cut = () => p.evaluate(() => {
      const card = document.getElementById("card"), c = card.getBoundingClientRect(), out = [];
      for (const el of card.children) {
        if (el.hidden || !el.offsetHeight) continue;
        const b = el.getBoundingClientRect();
        if (b.top < c.top - 1 || b.bottom > c.bottom + 1) out.push(`${el.id} by ${Math.ceil(Math.max(c.top - b.top, b.bottom - c.bottom))}px`);
        if (getComputedStyle(el).overflowY !== "visible" && el.scrollHeight > el.clientHeight + 1) out.push(`${el.id} scrolls ${el.scrollHeight - el.clientHeight}px`);
      }
      return out;
    });
    const where = `Is It Enough? at ${width}×${height} (${run.lang}), ${note}`;
    for (const x of await cut()) fail(`${where}: ${x} is cut off the card`);
    if (await p.$eval("#yn", e => !e.hidden)) await p.click(".choices button[data-correct=false]");
    else { const a = await p.$eval(".eq .ans", e => e.dataset.a); await p.click(`#k${(+a + 1) % 10}`); await p.click("#k-go"); }
    for (const x of await cut()) fail(`${where}, after a wrong answer: ${x} is cut off the card`);
    await ctx.close();
  }
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
        await money(p, fail, game);
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
      // Only a finished Today's 10 counts a day for the day streak, never right answers in another game.
      const todays10 = game === "mix/daily-mix/";
      if (todays10) { await p.locator("#next").click(); await p.locator("#results").waitFor({ state: "visible", timeout: 5000 }); }
      const doneToday = await p.evaluate(() => Loopy.daily.get().doneToday);
      if (doneToday !== todays10) fail(todays10 ? "finishing Today's 10 did not count the day" : `${rightCount} right answers counted as a day, which only Today's 10 does`);
      const qs = keys.filter(k => k !== "\x00");
      rows.push(`| ${game} | ${run.age} | ${run.lang} | ${qs.length} | ${new Set(qs).size} | ${rightCount} | ${bad.length ? "repeats" : "pass"} |`);
    } catch (e) {
      // The first line says what timed out; the last lines of the call log say on what, and what was in the way.
      const log = e.message.split("\n").slice(1).map(l => l.trim()).filter(Boolean).slice(-8);
      // A tap that waited for "visible, enabled and stable" and never got it: say which of the three failed, by
      // reading the element the way Playwright does (checkVisibility, its style, its box over ten frames).
      const sel = /waiting for locator\('(.+?)'\)/.exec(e.message);
      let why = "";
      if (p && sel && /stable/.test(e.message)) why = await p.evaluate(async (s) => {
        const el = document.querySelector(s); if (!el) return "gone now";
        const boxes = [];
        for (let i = 0; i < 10; i++) { const r = el.getBoundingClientRect(); boxes.push(`${r.x.toFixed(1)},${r.y.toFixed(1)},${r.width.toFixed(1)}`); await new Promise(f => requestAnimationFrame(f)); }
        const st = getComputedStyle(el);
        return `checkVisibility ${el.checkVisibility ? el.checkVisibility() : "n/a"}, visibility ${st.visibility}, disabled ${el.disabled}, ` +
          `aria-disabled ${el.closest("[aria-disabled]")?.getAttribute("aria-disabled") || "none"}, inert ${!!el.closest("[inert]")}, boxes ${[...new Set(boxes)].join(" | ")}, fonts ${document.fonts.status}, bar ${document.querySelector(".game-bar")?.className}`;
      }, sel[1].replace(/\\"/g, '"')).catch(x => `no read: ${x.message.split("\n")[0]}`);
      fail(`could not play: ${[e.message.split("\n")[0], ...log, why].filter(Boolean).join(" / ")}`);
      rows.push(`| ${game} | ${run.age} | ${run.lang} | - | - | - | error |`);
    }
    if (p) await p.context().close();
    if (game === "mix/class-test/") { try { await classTestMoney(run, fail); } catch (e) { fail(`money task: ${e.message.split("\n")[0]}`); } }
    if (game === "math/enough-money/" && run.lang === "de") { try { await enoughMoneyFits(run, fail); } catch (e) { fail(`card fit: ${e.message.split("\n")[0]}`); } }
    if (WORDS_IN[game]) { try { await wordsFollowLanguage(game, run, fail); } catch (e) { fail(`words language: ${e.message.split("\n")[0]}`); } }
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
