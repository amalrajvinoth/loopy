// Screen reader and keyboard check for every loopy page. See tools/a11y/README.md.
//
//   npm ci --prefix tools/a11y        (once: installs axe-core and playwright-core, never shipped)
//   node tools/a11y/check.mjs         (exit code 1 if anything fails)
//
// It serves the site on a random local port, opens every page in Chrome or Chromium and checks:
//   1. axe-core (WCAG 2.1 A and AA, plus best practices) in every theme, with Settings closed and open,
//      in English and German.
//   2. Keyboard: Tab reaches every control, each one has a name and a visible focus ring with
//      at least 3:1 contrast against the page.
//   3. Escape closes Settings and puts focus back on the Settings button.
//   4. Each game can be played with the keyboard only: answer, then Next, and focus lands on the
//      new problem's first answer (never lost to the page). A right or wrong answer is announced.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || HERE, "package.json"));
const { chromium } = require("playwright-core");
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

// Every theme in src/loopy.css (a theme sets its own --bg).
const THEMES = [...new Set([...fs.readFileSync(path.join(ROOT, "src/loopy.css"), "utf8")
  .matchAll(/:root\[data-theme="([a-z]+)"\]\s*\{[^}]*--bg:/g)].map(m => m[1]))];
const PAGES = ["", "help/", "progress/"];
for (const subject of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, subject);
  if (!fs.statSync(dir).isDirectory() || /^[._]|^(docs|fonts|tools|src|help|progress|node_modules)$/.test(subject)) continue;
  for (const game of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, game, "index.html");
    // Old addresses that only forward to a new one (e.g. plus-minus-100) have nothing to check.
    if (fs.existsSync(file) && !/http-equiv="refresh"|location\.replace/.test(fs.readFileSync(file, "utf8"))) PAGES.push(`${subject}/${game}/`);
  }
}
const GAMES = PAGES.filter(p => p.split("/").length === 3);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

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
const fail = (where, what) => problems.push(`${where}: ${what}`);
const results = { axe: 0, tab: 0, esc: 0, play: 0 };

async function open(page, theme = "black", lang = "en", size = { width: 390, height: 844 }) {
  // bypassCSP only lets the checker add axe-core; the pages themselves are unchanged.
  const ctx = await browser.newContext({ viewport: size, bypassCSP: true, reducedMotion: "reduce" });
  await ctx.addInitScript(([t, l]) => {
    localStorage.setItem("loopy.theme", t); localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off");
    localStorage.setItem("loopy.readAloud", "off");
  }, [theme, lang]);
  const p = await ctx.newPage();
  p.on("pageerror", e => fail(page || "home", `script error: ${e.message}`));
  await p.goto(BASE + page);
  await p.waitForFunction(() => !document.documentElement.classList.contains("loopy-building"));
  await p.evaluate(() => document.fonts.ready.then(() => null));
  await p.waitForTimeout(150);
  return p;
}

// 1. axe-core
async function axe(p, where) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(() => window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }));
  for (const v of r.violations) for (const n of v.nodes) fail(where, `${v.id} on ${n.target.join(" ")} (${v.help})`);
  results.axe++;
}
for (const page of PAGES) {
  for (const theme of THEMES) {
    for (const lang of theme === "black" ? ["en", "de"] : ["en"]) {
      const p = await open(page, theme, lang);
      const where = `${page || "home"} [${theme}, ${lang}]`;
      await axe(p, where);
      if (await p.$("#settings-toggle")) { await p.click("#settings-toggle"); await axe(p, where + " Settings open"); }
      // The "Add a child" window, from Kids in the home page's Settings.
      const add = await p.$(".kid-row.add");
      if (add) { await add.click(); await p.waitForTimeout(100); if (await p.$("dialog[open]")) await axe(p, where + " Add a child open"); }
      await p.context().close();
    }
  }
}

// 2. Tab through every control (Settings open), in every theme.
function contrast(a, b) {
  const lum = c => { const [r, g, b2] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b2; };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
for (const page of PAGES) {
  for (const theme of THEMES) {
    const p = await open(page, theme);
    if (await p.$("#settings-toggle")) await p.click("#settings-toggle");
    await p.evaluate(() => document.activeElement && document.activeElement.blur());
    const seen = new Set();
    for (let i = 0; i < 300; i++) {
      await p.keyboard.press("Tab");
      const f = await p.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return null;
        const rgb = s => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
        const cs = getComputedStyle(e), r = e.getBoundingClientRect();
        let bg = document.body, bgc = getComputedStyle(bg).backgroundColor;
        if (/rgba\(0, 0, 0, 0\)|transparent/.test(bgc)) bgc = getComputedStyle(document.documentElement).backgroundColor;
        const svg = e instanceof SVGElement;
        const ring = svg ? cs.stroke !== "none" && parseFloat(cs.strokeWidth) >= 2
          : cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2;
        const label = e.labels && e.labels.length ? e.labels[0].textContent : "";
        const name = (e.getAttribute("aria-label") || label || e.textContent || e.getAttribute("title") || "").trim();
        return { key: e.id || e.outerHTML.slice(0, 80), id: e.id ? "#" + e.id : e.tagName.toLowerCase() + "." + (e.getAttribute("class") || ""),
          name, ring, visible: r.width > 0 && r.height > 0, svg,
          color: rgb(svg ? cs.stroke : cs.outlineColor), bg: rgb(bgc) };
      });
      if (!f || seen.has(f.key)) break;
      seen.add(f.key);
      const where = `${page || "home"} [${theme}] Tab to ${f.id}`;
      if (!f.visible) fail(where, "focus goes to something you cannot see");
      if (!f.name) fail(where, "no name for screen readers");
      if (!f.ring) fail(where, "no visible focus ring");
      else if (!f.svg && contrast(f.color, f.bg) < 3) fail(where, `focus ring contrast ${contrast(f.color, f.bg).toFixed(2)}:1, needs 3:1`);
    }
    if (!seen.size) fail(`${page || "home"} [${theme}]`, "Tab reaches nothing");
    results.tab++;
    await p.context().close();
  }
}

// 3. Escape closes Settings.
for (const page of PAGES) {
  const p = await open(page);
  if (!(await p.$("#settings-toggle"))) { await p.context().close(); continue; }
  await p.focus("#settings-toggle"); await p.keyboard.press("Enter");
  await p.keyboard.press("Tab");
  await p.keyboard.press("Escape");
  const ok = await p.evaluate(() => document.getElementById("settings-panel").hidden && document.activeElement.id === "settings-toggle");
  if (!ok) fail(page, "Escape does not close Settings and return focus to the Settings button");
  results.esc++;
  await p.context().close();
}

// 4. Play each game with the keyboard only.
for (const page of GAMES) {
  const p = await open(page);
  const where = `${page} keyboard play`;
  const focusIn = () => p.evaluate(() => {
    const e = document.activeElement;
    return e === document.body ? "page" : (e.id ? "#" + e.id : e.tagName.toLowerCase());
  });
  // Tab to the first answer in the play area (past the "Hear the word" and "Read aloud" buttons).
  let found = false;
  for (let i = 0; i < 60 && !found; i++) {
    await p.keyboard.press("Tab");
    found = await p.evaluate(() => { const e = document.activeElement; return !!(e.closest("#choices, #answers, #pad, #letters, #words, #map") ); });
  }
  if (!found) { fail(where, "Tab never reaches the answers"); await p.context().close(); continue; }
  const said = () => p.evaluate(() => {
    const live = [...document.querySelectorAll(".loopy-sr, #feedback[aria-live]")].map(n => n.textContent.trim()).join(" ");
    return live;
  });
  for (let round = 0; round < 2; round++) {
    // Answer: choices and the map are picked with Enter; the number and letter pads are typed into, then Check.
    const pad = await p.evaluate(() => !!document.activeElement.closest("#pad, #letters, #words"));
    if (pad) {
      // Type with the focused key until Check turns on, then Tab to Check and press Enter.
      for (let i = 0; i < 10 && await p.evaluate(() => document.getElementById("k-go").disabled); i++) await p.keyboard.press("Enter");
      await p.focus("#k-go"); await p.keyboard.press("Enter");
    }
    else await p.keyboard.press("Enter");
    await p.waitForTimeout(200);
    if (await p.$(".loopy-cheer.big")) { await p.keyboard.press("Enter"); await p.waitForTimeout(300); }
    if (!(await said())) fail(where, "the answer is not announced to screen readers");
    if ((await focusIn()) === "page") fail(where, "focus is lost after answering");
    const next = await p.$("#next");
    if (next && await next.isVisible()) {
      await p.focus("#next"); await p.keyboard.press("Enter"); await p.waitForTimeout(250);
      const at = await p.evaluate(() => !!document.activeElement.closest("#choices, #answers, #map"));
      if (!at) fail(where, `after Next, focus is on ${await focusIn()}, not on the first answer`);
    } else if (!pad) {
      await p.waitForTimeout(2600);
      if ((await focusIn()) === "page") fail(where, "focus is lost when the next problem comes");
    }
    if (pad) {
      // Check is now Next: Enter on it brings the next problem, and focus must go back to the keys.
      await p.waitForTimeout(300);
      await p.keyboard.press("Enter"); await p.waitForTimeout(250);
      if (!(await p.evaluate(() => !!document.activeElement.closest("#pad, #letters, #words")))) fail(where, `after Next, focus is on ${await focusIn()}, not on the keys`);
    }
  }
  results.play++;
  await p.context().close();
}

await browser.close();
server.close();

console.log(`| Check | Pages | Result |\n|---|---|---|`);
const ok = what => problems.some(x => x.includes(what)) ? "problems" : "pass";
console.log(`| axe-core, WCAG 2.1 AA + best practice (${THEMES.length} themes, EN + DE, Settings open and closed) | ${PAGES.length} | ${results.axe} runs |`);
console.log(`| Tab order, names, focus ring (3:1), ${THEMES.length} themes | ${PAGES.length} | ${results.tab} runs |`);
console.log(`| Escape closes Settings | ${results.esc} | ${ok("Escape")} |`);
console.log(`| Keyboard-only play, answer announced | ${results.play} | ${ok("keyboard play")} |`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const x of problems) console.log("  " + x);
  process.exit(1);
}
console.log("\nNo problems found.");
