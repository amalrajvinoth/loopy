// Pictures for the guide: every game, and the main parts of the site, in English and German.
//
//   npm ci --prefix ../tools/a11y --ignore-scripts    (once: the same Chrome driver as the play test)
//   npm run screens                                   (or: node scripts/screens.mjs plus-minus  for one game)
//
// They go to src/assets/screens/<en|de>/. The build turns them into small WebP files.
// A phone (390 × 844) for games and the home page, a computer for the grown-ups page.
// Before the pictures, it plays a few rounds so the stars, badges and grown-ups page are not empty.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { start } from "./serve.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.resolve(HERE, "../src/assets/screens");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");
const ONLY = process.argv[2] || "";

// The games, from the home page list, plus Today's 10.
const home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const GAMES = [...home.matchAll(/path: "([a-z]+\/[a-z0-9-]+)\/"/g)].map((m) => m[1]).filter((g, i, a) => a.indexOf(g) === i);
if (!GAMES.includes("mix/daily-mix")) GAMES.unshift("mix/daily-mix");

async function launch() {
  for (const p of [process.env.CHROME, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"])
    if (p && fs.existsSync(p)) return chromium.launch({ executablePath: p });
  return chromium.launch({ channel: "chrome" });
}

const { server, origin } = await start();
const BASE = origin + "/loopy/";
const browser = await launch();
const save = (p, lang, name, opts = {}) => p.screenshot({ path: path.join(OUT, lang, name + ".jpg"), type: "jpeg", quality: 72, ...opts });
const pause = (p, ms = 400) => p.waitForTimeout(ms);

async function context(lang, viewport = { width: 390, height: 844 }, scale = 1.4) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, reducedMotion: "reduce", serviceWorkers: "block", colorScheme: "dark" });
  await ctx.addInitScript((l) => {
    if (!localStorage.getItem("loopy.shots")) {
      localStorage.setItem("loopy.shots", "1");
      localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off"); localStorage.setItem("loopy.readAloud", "off");
    }
  }, lang);
  ctx.setDefaultTimeout(6000);
  return ctx;
}

// Close a level-up or badge window, so the next picture shows the game.
async function closeCheer(p) {
  for (let i = 0; i < 3; i++) {
    const big = p.locator(".loopy-cheer.big button");
    if (!(await big.count())) return;
    await big.last().click(); await pause(p, 250);
  }
}

// Play a choice game: tap a wrong answer first (wrong times), then the right one, and go on.
// Games with choices mark each one with data-correct.
async function play(p, game, right, wrong = 0) {
  await p.goto(BASE + game + "/"); await pause(p, 600);
  for (let i = 0; i < right + wrong; i++) {
    const pick = p.locator(`[data-correct="${i >= wrong}"]:enabled`);
    if (!(await pick.count())) break;
    await pick.first().click(); await pause(p, 250);
    await closeCheer(p);
    const next = p.locator("#next");
    if (await next.count() && await next.isVisible() && await next.isEnabled()) await next.click();
    await pause(p, 250);
  }
}

for (const lang of ["en", "de"]) {
  fs.mkdirSync(path.join(OUT, lang), { recursive: true });
  const ctx = await context(lang);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.error(`${lang} ${p.url()}: ${e.message}`));

  // Each game as it opens.
  for (const game of GAMES.filter((g) => g.includes(ONLY))) {
    await p.goto(BASE + game + "/"); await pause(p, 700);
    await save(p, lang, game.replace("/", "-"));
    console.log(`${lang} ${game}`);
  }
  if (ONLY) { await ctx.close(); continue; }

  // Some play first, so the stars and the grown-ups page have something to show.
  await play(p, "science/quick-facts", 6, 1);
  await play(p, "math/what-time-is-it", 14, 2);

  // A game, its Settings, and the Report a problem box.
  await p.goto(BASE + "math/plus-minus/"); await pause(p, 700);
  await save(p, lang, "game");
  await p.click("#settings-toggle"); await pause(p);
  await save(p, lang, "game-settings");
  await p.click("#settings-toggle"); await pause(p, 300);
  const flag = p.locator(".report-toggle");
  if (await flag.isVisible()) { await flag.click(); await pause(p, 900); await save(p, lang, "report"); }

  // The home page, its Settings, My stars and Move my stars.
  await p.goto(BASE); await pause(p, 800);
  await save(p, lang, "home");
  await p.click("#settings-toggle"); await pause(p);
  await save(p, lang, "home-settings");
  await p.click("#settings-toggle"); await pause(p, 300);
  await p.click(".shelf .fold summary"); await pause(p);
  await p.locator(".shelf").scrollIntoViewIfNeeded();
  await save(p, lang, "my-stars", { clip: await box(p, ".shelf-top", ".fold") });
  await p.click(".shelf .fold summary");
  await p.click(".shelf .transfer summary"); await pause(p, 800);
  await p.locator(".shelf .transfer").scrollIntoViewIfNeeded();
  await save(p, lang, "move-stars", { clip: await box(p, ".shelf .transfer", ".shelf .transfer") });
  await ctx.close();
  console.log(`${lang} site pictures`);
}

// The grown-ups page, on a computer, after the same few rounds.
for (const lang of ["en", "de"]) {
  if (ONLY) break;
  const ctx = await context(lang, { width: 1280, height: 860 }, 1);
  const p = await ctx.newPage();
  await play(p, "science/quick-facts", 6, 1);
  await play(p, "math/what-time-is-it", 14, 2);
  await p.goto(BASE + "progress/"); await pause(p, 900);
  await save(p, lang, "grown-ups");
  await ctx.close();
}

// The page area from the top of one element to the bottom of another.
async function box(p, top, bottom) {
  const a = await p.locator(top).first().boundingBox(), b = await p.locator(bottom).first().boundingBox();
  const y = Math.max(0, a.y - 12);
  return { x: 0, y, width: 390, height: Math.min(844 - y, b.y + b.height - y + 12) };
}

await browser.close();
server.close();
