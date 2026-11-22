# Checking speed and size

Read when the change touches a page, `src/` or anything a page loads.

Always look for a chance to make loopy faster or smaller, even if the change is not about speed. List what you find as a suggestion, with the size or time it saves.

- **Code.** `loopy.js` and `loopy.css` load on every page, so every byte counts many times. Code that only one page uses belongs in that page. Remove code nothing calls. Do no work on load that can wait until it is needed (the "Easier to read" font only loads when that setting is on). No timers or animation loops that run when nothing moves. Read and parse saved data once, not on every answer.
- **Memory.** Keep what is saved small and capped: a list grows only to a fixed size or number of days (like `loopy.log`, 30 days). Save only what is needed to play on, not whole questions or pictures. Do not keep big lists in memory after they are used.
- **Delivery.** Pages stay small: `tools/review.py` flags a page over 100 KB sent (with `loopy.js`, `loopy.css` and fonts), `loopy.js` or `loopy.css` growing by more than 1 KB, a page growing by more than 2 KB, and the offline copy growing by more than 50 KB. No new fonts; letters outside the font subset use the device font. Pictures are SVG or small PNGs. The offline helper (`sw.js`) must not cache what a page never uses. Preload only the font the first screen needs.
- **Lighthouse.** For a change to a page or shared code, run Lighthouse (phone, slow 4G) on a home page and one changed page with a server that compresses like GitHub Pages. Performance should stay at 100. If the README size table is out of date, update it.
