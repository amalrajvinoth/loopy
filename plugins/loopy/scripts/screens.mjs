// Screenshots of loopy pages at the 5 DESIGN.md screen sizes, in English and German, and a check
// that nothing scrolls. Used by the ship-pr skill and the screens agent for before/after pictures.
//
//   node plugins/loopy/scripts/screens.mjs [pages...] [--out DIR] [--root DIR] [--theme black|sunny|...]
//
//   pages   site paths like math/plus-minus/ (default: every page that changed against origin/main,
//           or the home page when none did)
//   --out   where the PNGs go (default: screens/ in the current folder), named <page>-<w>x<h>-<lang>.png
//   --root  which checkout to serve (default: this one). Point it at a worktree of origin/main for "before".
//
// Needs the packages of the accessibility check once: npm ci --prefix tools/a11y --ignore-scripts
// Exit code 1 if any page scrolls (sideways, or down on a game page with Settings closed).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); if (i === -1) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const OUT = path.resolve(opt("--out", "screens"));
const ROOT = path.resolve(opt("--root", REPO));
const THEME = opt("--theme", "");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(REPO, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");

// The screen sizes in DESIGN.md "Screens". plugins/loopy/scripts/drift.py checks they still match.
const SIZES = [[360, 640], [390, 844], [844, 390], [820, 1180], [1180, 820]];
const LANGS = ["en", "de"];

function changedPages() {
  try {
    const out = execFileSync("git", ["diff", "--name-only", "origin/main...HEAD"], { cwd: REPO, encoding: "utf8" })
      + execFileSync("git", ["diff", "--name-only"], { cwd: REPO, encoding: "utf8" });
    const files = [...new Set(out.split("\n").filter(Boolean))];
    if (files.some(f => f.startsWith("src/"))) return ["", "math/plus-minus/", "languages/word-match/", "mix/daily-mix/"];
    return [...new Set(files.filter(f => f.endsWith("index.html")).map(f => f.replace(/index\.html$/, "")))];
  } catch { return []; }
}
let pages = args.length ? args.map(p => p.replace(/^\/+/, "").replace(/index\.html$/, "")) : changedPages();
if (!pages.length) pages = [""];

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json" };
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
  for (const p of ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"])
    if (fs.existsSync(p)) tries.push({ executablePath: p });
  tries.push({ channel: "chrome" });
  for (const t of tries) { try { return await chromium.launch(t); } catch { /* next */ } }
  throw new Error("No Chrome or Chromium found. Set CHROME=/path/to/chrome.");
}
const browser = await launch();
fs.mkdirSync(OUT, { recursive: true });
const scrolls = [];
for (const page of pages) {
  for (const [w, h] of SIZES) for (const lang of LANGS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", serviceWorkers: "block" });
    await ctx.addInitScript(([l, t]) => {
      localStorage.setItem("loopy.lang", l); localStorage.setItem("loopy.sound", "off");
      if (t) localStorage.setItem("loopy.theme", t);
    }, [lang, THEME]);
    const tab = await ctx.newPage();
    await tab.goto(BASE + page, { waitUntil: "networkidle" });
    await tab.waitForTimeout(300);
    const name = `${(page || "home").replace(/\/$/, "").replace(/\//g, "-")}-${w}x${h}-${lang}.png`;
    await tab.screenshot({ path: path.join(OUT, name) });
    const s = await tab.evaluate(() => ({ sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight,
      w: innerWidth, h: innerHeight }));
    const game = /^[a-z]+\/[a-z0-9-]+\/$/.test(page) && !/^(help|progress)\//.test(page);
    if (s.sw > s.w + 1 || (game && s.sh > s.h + 1)) scrolls.push(`${page || "home"} at ${w}×${h} (${lang}): page is ${s.sw}×${s.sh}`);
    await ctx.close();
  }
}
await browser.close();
server.close();
console.log(`Saved ${pages.length * SIZES.length * LANGS.length} screenshots in ${OUT}`);
if (scrolls.length) { console.log("These scroll:\n - " + scrolls.join("\n - ")); process.exit(1); }
console.log("Nothing scrolls.");
