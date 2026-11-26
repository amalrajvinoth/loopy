// Picture test: the home page and a set of games must still look the same.
//
// It takes a picture of each page at the eight DESIGN.md sizes, in English and in German, and compares it with the
// saved picture in tools/e2e/pictures/. A shared CSS change that moves a button or cuts off a row goes red here,
// before the pull request is merged, with the new picture and a diff picture to look at.
//
//   node tools/e2e/pictures.mjs                 compare (exit 1 on a difference; new pictures and diffs in --out)
//   ENGINE=pinned UPDATE=1 node tools/e2e/pictures.mjs    save the pictures as they are now (when a change is meant to look different;
//                                               from a fork, where the Refresh pictures workflow cannot push, this is the way)
//   PAGE=math/plus-minus/ node tools/e2e/pictures.mjs       one page
//   node tools/e2e/pictures.mjs --out DIR       where the new and diff pictures go (default: pictures-out/ in the current folder)
//
// So the pictures match from run to run: every page gets the same random numbers (Math.random is seeded),
// the same clock (20 Nov 2026, 10:00), no animations, the first-visit welcome already seen, and the fonts
// loaded before the picture. The GitHub check runs it in Playwright's own pinned Chromium build
// (ENGINE=pinned), not the runner's Chrome, so a browser update cannot change the pictures by itself.
// When Dependabot updates playwright-core, the pictures may need a refresh: Actions → "Refresh pictures".
//
// Needs the packages of the accessibility check once: npm ci --prefix tools/a11y --ignore-scripts
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { launch, ENGINE, body, picked } from "./engine.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { PNG } = require("pngjs");
const pixelmatch = (m => m.default || m)(require("pixelmatch")); // pixelmatch 8 is an ES module

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); if (i === -1) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const OUT = path.resolve(opt("--out", "pictures-out"));
const SAVED = path.join(HERE, "pictures");
const UPDATE = !!process.env.UPDATE;

// The home page and six games that between them use every shared part: the sum card, the number pad, the
// letter keyboard, the clock picture, the flag pictures and the choice buttons. Not Calendar and Dates
// (it shows today's date) and not Today's 10 (it changes with the day).
const PAGES = ["", "math/plus-minus/", "math/make-10/", "math/what-time-is-it/", "languages/word-detective/", "geography/flags-capitals/", "science/quick-facts/"];
// The eight DESIGN.md sizes: three phones upright, a phone on its side, a tablet both ways, a laptop, a monitor.
const SIZES = [[360, 640], [390, 844], [430, 932], [844, 390], [820, 1180], [1180, 820], [1280, 800], [1920, 1080]];
// Both languages at every size (112 pictures, about 10 MB): German's longer words break a row where English fits.
const LANGS = ["en", "de"];
// How different two pictures may be: a pixel counts as changed past this colour distance (0 to 1), and the
// picture fails past this share of changed pixels. Anti-aliasing never reaches it; a moved button does.
const THRESHOLD = 0.15, MAX_SHARE = 0.003;

// PAGE=<path> takes one page; PAGES (from tools/ci_changes.py) keeps only the pages a change touches.
const pages = process.env.PAGE ? [process.env.PAGE.replace(/^\/+/, "").replace(/index\.html$/, "")] : picked(PAGES);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json" };
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
const BASE = `http://127.0.0.1:${server.address().port}/loopy/`;

// The same random numbers on every run (a small xorshift, seeded), so every game asks the same first question.
const SEEDED_RANDOM = `(function () {
  var s = 0x9e3779b9;
  Math.random = function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
})();`;
const NO_MOTION = "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }";

const browser = await launch();
fs.mkdirSync(OUT, { recursive: true });
if (UPDATE) fs.mkdirSync(SAVED, { recursive: true });
const rows = [], problems = [];

for (const page of pages) {
  for (const [w, h] of SIZES) {
    for (const lang of LANGS) {
      const name = `${(page || "home").replace(/\/$/, "").replace(/\//g, "-")}-${w}x${h}-${lang}.png`;
      const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce", bypassCSP: true, locale: lang === "de" ? "de-DE" : "en-GB" }); // bypassCSP only lets the no-motion style in; the pages still load nothing from outside
      const p = await context.newPage();
      await p.clock.setFixedTime(new Date("2026-11-20T10:00:00"));
      await p.addInitScript(SEEDED_RANDOM);
      await p.addInitScript((lang) => {
        localStorage.setItem("loopy.lang", lang);
        localStorage.setItem("loopy.hello", JSON.stringify({ w: 1 }));
      }, lang);
      await p.goto(BASE + page, { waitUntil: "networkidle" });
      await p.addStyleTag({ content: NO_MOTION });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(250);
      const shot = PNG.sync.read(await p.screenshot({ fullPage: false }));
      await context.close();
      const saved = path.join(SAVED, name);
      if (UPDATE || !fs.existsSync(saved)) {
        if (UPDATE) { fs.writeFileSync(saved, PNG.sync.write(shot, { deflateLevel: 9 })); rows.push([name, "saved"]); }
        else { fs.writeFileSync(path.join(OUT, name), PNG.sync.write(shot, { deflateLevel: 9 })); rows.push([name, "no saved picture"]); problems.push(`${name}: no saved picture yet. Run UPDATE=1 node tools/e2e/pictures.mjs and commit tools/e2e/pictures/.`); }
        continue;
      }
      const was = PNG.sync.read(fs.readFileSync(saved));
      if (was.width !== shot.width || was.height !== shot.height) {
        fs.writeFileSync(path.join(OUT, name), PNG.sync.write(shot, { deflateLevel: 9 }));
        rows.push([name, `size ${shot.width}x${shot.height}, saved ${was.width}x${was.height}`]);
        problems.push(`${name}: the picture has another size than the saved one.`);
        continue;
      }
      const diff = new PNG({ width: w, height: h });
      const changed = pixelmatch(was.data, shot.data, diff.data, w, h, { threshold: THRESHOLD });
      const share = changed / (w * h);
      if (share > MAX_SHARE) {
        fs.writeFileSync(path.join(OUT, name), PNG.sync.write(shot, { deflateLevel: 9 }));
        fs.writeFileSync(path.join(OUT, name.replace(/\.png$/, "-diff.png")), PNG.sync.write(diff, { deflateLevel: 9 }));
        rows.push([name, `${(share * 100).toFixed(2)}% of the pixels changed`]);
        problems.push(`${name}: ${(share * 100).toFixed(2)}% of the pixels changed (allowed ${MAX_SHARE * 100}%). New picture and diff in ${path.relative(process.cwd(), OUT) || "."}/.`);
      } else {
        rows.push([name, changed ? `same (${changed} pixels differ)` : "same"]);
      }
    }
  }
}
await browser.close();
server.close();

console.log(`Picture test in ${ENGINE}${UPDATE ? ", saving the pictures" : ""}:\n`);
console.log("| Picture | Result |\n|---|---|");
for (const [name, result] of rows) console.log(`| ${name} | ${result} |`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  console.log("\nIf the change is meant to look like this, refresh the saved pictures: put the label \"refresh pictures\" on the pull request (or Actions → Refresh pictures with the branch). They come from the pinned Chromium on the runner, not from here.");
  process.exit(1);
}
console.log(UPDATE ? `\nSaved ${rows.length} pictures in tools/e2e/pictures/.` : "\nEvery page still looks the same.");
