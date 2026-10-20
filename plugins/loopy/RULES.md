# loopy rules

Every session in the loopy repo starts with these. Add one with the add-rule skill.

## Site
- loopy is free learning games for kids in grades 1 to 10. No ads, no sign-up, no tracking. Name is lowercase "loopy" on screen.
- Every page loads one shared `loopy.js` and `loopy.css`. Five small parts load only when needed: `loopy-report.js` (the Report a problem box), `loopy-backup.js` (the stars code), `loopy-sheet.js` with `print.css` (the worksheet), `loopy-levels.js` (every game's levels, for the grown-ups page) and `loopy-install.js` (the Add to home screen steps), through `Loopy.load()`. Edit `src/`, never the built root copies, then run `python3 tools/build.py`. (A hook blocks edits to the built files.)
- A game is a folder `<subject>/<game>/index.html` plus one line in the home page GAMES list. A new game id goes in the 3 GAMES lists in `src/loopy.js` and the progress page list. Do not change other games or the layout unless asked.
- English (default) and German for every word: `Loopy.addStrings({en,de})`, `data-t`, `Loopy.t()`, `Loopy.num()`.
- Difficulty follows the age picker. Right and wrong go through `Loopy.rewards.correct()` / `.wrong()`. Questions come from `Loopy.fresh()` (no repeat within 10).
- One phone or tablet screen, no scrolling, portrait and landscape: 360×640, 390×844, 844×390, 820×1180, 1180×820. Settings behind ⚙. Follow DESIGN.md and keep it in sync.
- Black is the default theme. Others: Sunny, Ocean, Candy, Forest, High contrast.
- Everything that prints shows the real loopy logo (`Loopy.logo()`, not just the word) in a fitting place: top right on worksheets and the weekly card, top left on a printed page. A new print needs it too. (Owner's rule, 20 Oct 2026.)

## Safety
- No outside requests. No `style=` attributes, no `on*=` handlers (a hook blocks them). `tools/csp.py` and `tools/check_external.py` must pass.
- Saved data is never lost or reset: a changed key or format needs a migration, and old stars codes still import. Per-child data goes through `Loopy.store`. Validate everything read from storage. (Owner's rule, 16 Oct 2026.)

## Every change
- Look for speed and size wins (loopy.js size, work on load, what is saved, page size, fonts, sw.js cache, Lighthouse) and say in the PR what was found, or that nothing was. (16 Oct 2026.)
- Review with the loopy-review skill, run `tools/review.py`, the play test `node tools/e2e/play.mjs`, the Try again test `node tools/e2e/retry.mjs` and the accessibility check `node tools/a11y/check.mjs`.
- Every game logs a short rebuild note with each wrong answer and asks for its questions through `Loopy.retry.fresh`, so a mistake comes back (Try again). `tools/e2e/retry.mjs` checks it.
- Docs in plain, short sentences. Each game has its own README. After a major merge add a parent-friendly row at the top of RELEASES.md.
- Pull requests use `.github/pull_request_template.md`, with before and after screenshots when the screen changes.

## Roadmap
- GitHub issues, order in issue #21. "Start next", "Take next task", "Pickup next task", "take next 3 tasks", "Build #N" mean: build the next open issue(s) in that order, open a PR against main, close the issue on merge.
- Claude cannot change GitHub repo settings or open github.io. Give the owner exact steps, or ask them to check the live site.
