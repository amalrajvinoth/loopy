// End-to-end test: every game as a home screen app, with the phone's or tablet's own bar over the bottom of the
// screen. See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the play test)
//   node tools/e2e/taskbar.mjs                    (exit code 1 if anything fails; GAME=chess-puzzles for one game)
//
// Chrome on Android draws a home screen app under the system's bar at the bottom: the gesture bar on a phone
// (about 24px), the taskbar with back, home and apps on a tablet (48px). It can report that bar's height as 0,
// so loopy keeps a floor under the page (--safe-bottom in src/loopy.css). Issue #366: Chess Puzzles lost its
// Clue and Skip row under a tablet's taskbar.
//
// The test opens every game in that state: the home screen app's rules on (headless Chrome cannot be a home
// screen app, so the server turns that @media rule on for every screen), the bar reported as 0, at a phone and
// three tablet sizes. Then it checks that nothing a child taps or reads sits under the bar, that the page does not
// scroll, and that on a tablet the first-time hint, pushed around by the smaller room, covers no button.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launch, ENGINE, body } from "./engine.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");

// The screens and the system bar on each: the Android tablet from issue #366, an iPad-sized tablet both ways, a phone.
const SCREENS = [
  { w: 720, h: 1112, bar: 48 }, { w: 820, h: 1180, bar: 48 }, { w: 1180, h: 820, bar: 48 }, { w: 390, h: 844, bar: 24 },
];
// The home screen app's rule in the built loopy.css. The test fails if it is gone, so it never passes by testing nothing.
const APP_RULE = "@media(display-mode:standalone)and (pointer:coarse),(display-mode:fullscreen)and (pointer:coarse)";

// Every <subject>/<game>/index.html, except old addresses that only forward to a new one (as in play.mjs).
const GAMES = [], ONLY = process.env.GAME || "";
for (const subject of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, subject);
  if (!fs.statSync(dir).isDirectory() || /^[._]|^(docs|fonts|tools|src|help|progress|privacy|node_modules|guide-src|plugins|sync|images)$/.test(subject)) continue;
  for (const game of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, game, "index.html");
    if (`${subject}/${game}/`.includes(ONLY) && fs.existsSync(file) && !/http-equiv="refresh"|location\.replace/.test(fs.readFileSync(file, "utf8"))) GAMES.push(`${subject}/${game}/`);
  }
}

if (!GAMES.length) {
  console.error(`No game to test: GAME=${ONLY} names none of the games.`);
  process.exit(1);
}

const css = fs.readFileSync(path.join(ROOT, "loopy.css"), "utf8");
if (!css.includes(APP_RULE)) {
  console.error(`The home screen app rule is not in loopy.css any more:\n  ${APP_RULE}\nUpdate APP_RULE in tools/e2e/taskbar.mjs to the new rule.`);
  process.exit(1);
}

// The site at /loopy/, the way GitHub Pages serves it, with the home screen app's rule on.
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(ROOT, url.replace(/^\/loopy\//, "/"));
  if (!url.startsWith("/loopy/") || !file.startsWith(ROOT)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(file === path.join(ROOT, "loopy.css") ? css.replace(APP_RULE, "@media all") : body(file));
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/loopy/`;

const browser = await launch();
const problems = [];

for (const s of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, hasTouch: true, reducedMotion: "reduce", serviceWorkers: "block" });
  ctx.setDefaultTimeout(10000);
  // No welcome sheet. The first-time hint shows, as on a child's first visit to each game.
  await ctx.addInitScript(() => { try { localStorage.setItem("loopy.hello", '{"w":1}'); } catch (e) { /* no storage */ } });
  const page = await ctx.newPage();
  for (const game of GAMES) {
    await page.goto(BASE + game, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready.then(() => new Promise(f => requestAnimationFrame(() => requestAnimationFrame(f)))));
    // The first-time hint looks for its spot again after 400ms and 1200ms (on a tablet the card grows its content
    // first, issue #370), so the test reads where it ends up.
    await page.waitForTimeout(1300);
    const found = await page.evaluate((bar) => {
      const out = [], limit = innerHeight - bar + 0.5;
      const se = document.scrollingElement;
      if (se.scrollHeight > innerHeight + 1) out.push(`the page scrolls (${se.scrollHeight}px tall)`);
      // What a child taps or reads: buttons, links, fields, the problem card. Fixed bubbles (hint, cheer) move by themselves.
      for (const e of document.querySelectorAll("button, a[href], input, select, textarea, [role=button], .problem-card, #card")) {
        if (e.closest("[hidden], dialog:not([open]), .settings-panel, .loopy-hint, .loopy-cheer, .loopy-plus")) continue;
        const st = getComputedStyle(e);
        if (st.visibility === "hidden" || st.display === "none") continue;
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height || r.bottom <= 0) continue;
        // A shape in a picture (the map's seas) is cut off at the picture's edge: count only what shows.
        const bottom = e.ownerSVGElement ? Math.min(r.bottom, e.ownerSVGElement.getBoundingClientRect().bottom) : r.bottom;
        if (bottom > limit) {
          const name = (e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.classList.length ? "." + [...e.classList].join(".") : ""))
            + (e.textContent.trim() ? ` "${e.textContent.trim().slice(0, 20)}"` : "");
          out.push(`${name} ends at ${Math.round(bottom)}px, under the bar from ${innerHeight - bar}px`);
        }
      }
      // On a tablet the first-time hint covers no button: the middle of each button stays clear of it.
      // (Phones are not checked yet: Word Trail and Step by Step lay the hint on keys there, see the PR of issue #366.)
      const hint = document.querySelector("body > .loopy-hint");
      if (hint && innerWidth >= 600) {
        const h = hint.getBoundingClientRect();
        for (const e of document.querySelectorAll("button, [role=button]")) {
          if (e.closest("[hidden], dialog:not([open]), .settings-panel") || !e.getClientRects().length) continue;
          const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
          if (x > h.left && x < h.right && y > h.top && y < h.bottom) out.push(`the first-time hint covers ${e.id ? "#" + e.id : "a button"} "${e.textContent.trim().slice(0, 20)}"`);
        }
      }
      return [...new Set(out)].slice(0, 4);
    }, s.bar);
    const where = `${game} at ${s.w}×${s.h} (bar ${s.bar}px)`;
    if (found.length) { problems.push(where); console.log(`  FAIL ${where}\n         ${found.join("\n         ")}`); }
    else console.log(`  ok   ${where}`);
  }
  await ctx.close();
}

await browser.close();
server.close();
console.log(`\n${ENGINE}: ${GAMES.length} games at ${SCREENS.length} sizes as a home screen app.`);
if (problems.length) {
  console.log(`${problems.length} covered by the bar at the bottom. Fix the page so it reads var(--safe-bottom) (src/loopy.css), never raw env().`);
  process.exit(1);
}
console.log("Nothing sits under the bar at the bottom.");
