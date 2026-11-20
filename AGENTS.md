<!-- Written by plugins/sync.py from plugins/loopy/RULES.md. Do not edit: add a rule there (the add-rule skill), then run python3 plugins/sync.py. -->
# loopy for coding agents

loopy is a free learning games website for kids in grades 1 to 10, in English and German. It is plain HTML, CSS and JavaScript: one shared script and style sheet, no framework, no outside requests. `DESIGN.md` says how it looks. The README's "For developers" part says how a game is built. The rules below are the project's standing rules. The owner's words in the task win where they differ.

## Build and check

```sh
npm ci --prefix tools/build --ignore-scripts        # once: the minifier (esbuild) and the type checker
python3 tools/build.py                              # after any edit in src/ or to a page: loopy.js, loopy.css, sw.js, page policies
python3 tools/build.py --check                      # what CI runs
node tools/build/node_modules/typescript/bin/tsc -p tools/build   # src/ type-checks against src/loopy.d.ts
python3 tools/csp.py --check && python3 tools/check_external.py && python3 tools/guide_check.py
python3 tools/review.py                             # the loopy rules, saved data, size and docs, against main
python3 plugins/sync.py --check && python3 plugins/loopy/scripts/drift.py
npm ci --prefix tools/a11y --ignore-scripts         # once: the browser tests
node tools/a11y/check.mjs && node tools/e2e/play.mjs && node tools/e2e/retry.mjs   # ENGINE=webkit runs them in Safari's engine
```

Pull requests go against `main`, from a branch, with `.github/pull_request_template.md`. Commit messages are plain words. No tool attribution lines anywhere.

## Rules

Every session in the loopy repo starts with these. Add one with the add-rule skill. `plugins/sync.py` writes them into `AGENTS.md` at the repo root (with how to build and check) for every coding agent, and `CLAUDE.md` loads that file; never edit those two by hand.

### Site
- loopy is free learning games for kids in grades 1 to 10. No ads, no sign-up, no tracking. Name is lowercase "loopy" on screen.
- Every page loads one shared `loopy.js` and `loopy.css`. Seven small parts load only when needed: `loopy-report.js` (the Report a problem box), `loopy-backup.js` (the stars code), `loopy-sheet.js` with `print.css` (the worksheet), `loopy-levels.js` (every game's levels, for the grown-ups page) `loopy-install.js` (the Add to home screen steps) `loopy-sync.js` (Family sync, only on devices where it is on) and `loopy-hello.js` (the first-visit welcome and the family code row, only while no family code is set), through `Loopy.load()`. Edit `src/`, never the built root copies, then run `python3 tools/build.py` (esbuild minifies; once: `npm ci --prefix tools/build --ignore-scripts`). `src/loopy.d.ts` says what `Loopy.*` offers and `tsc -p tools/build` checks `src/` against it: a new `Loopy` member goes in the `.d.ts` too. (A hook blocks edits to the built files.)
- A game is a folder `<subject>/<game>/index.html` plus one line in the home page GAMES list. Its word list or other content lives next to the page in `words.js` or `data.js` (Word Match and Word Trail share `languages/words.js`), loaded right after `loopy.js`. A new game id goes in the `Loopy.GAMES` list in `src/loopy.js` and the progress page list. Do not change other games or the layout unless asked.
- English (default) and German for every word: `Loopy.addStrings({en,de})`, `data-t`, `Loopy.t()`, `Loopy.num()`.
- German all the way: with loopy in German nothing on screen stays English. In a word game the words follow loopy's language; a "Words in" pick is remembered only with the loopy language it was made under (`<game>.words` + `<game>.wordsUi`). A German keyboard has the qwertz rows with ü, ö, ä and ß, and a letter pad mixes umlauts into its extras; they fit at 360px. (Owner's bug reports, 18 Nov 2026, PRs #292 and #296.)
- Difficulty follows the age picker. Right and wrong go through `Loopy.rewards.correct()` / `.wrong()`. Questions come from `Loopy.fresh()` (no repeat within 10).
- One phone or tablet screen, no scrolling, portrait and landscape: 360×640, 390×844, 430×932, 844×390, 820×1180, 1180×820, 1280×800, 1920×1080. Settings behind ⚙. Spacing and sizes come from the size-class variables in `src/loopy.css` (`--col`, `--big`, `--key-h` and the rest; DESIGN.md "Screens"), not from numbers copied into a page. The phone's bars are `--safe-top` and `--safe-bottom` (never raw `env(safe-area-inset-*)` in a page), so the home screen app keeps the bottom row above the gesture bar (PR #295). Follow DESIGN.md and keep it in sync.
- Black is the default theme. Others: Sunny, Ocean, Candy, Forest, High contrast.
- Everything that prints shows the real loopy logo (`Loopy.logo()`, not just the word) in a fitting place: top right on worksheets and the weekly card, top left on a printed page. A new print needs it too. (Owner's rule, 20 Oct 2026.)

### Games
- Nothing dead, nothing covered: Next shows only after an answer (its place stays empty where there is no Skip), the first-time hint covers no key or word and names the game's real first tap, and every game says "Correct!" and "Not quite." through the shared strings. (PR #273.)
- The main content fills the card and nothing is cut off: a sum, grid, text or picture grows with the card in container units up to `--big`, and is checked at the eight sizes fresh, after a wrong answer with the longest explanation and with Settings open; the tablet held upright overflows first. (PRs #266 and #276.)
- A helper line names only what is on the card, every note and coin shows its currency sign, and a picture borrowed from another game keeps that game's look. (PR #274.)
- When a question assumes something that is not true right now, the screen says "Pretend it is …", a badge shows it and Read aloud says it first. (What Time Is It? 24-hour level, PR #288.)
- A day in the day streak is a finished Today's 10, nothing else; right answers in other games earn stars only. (PR #269.)
- With a grown-up's word list: no picture that does not fit the words, the meaning comes only from the list, Try again replays only words still in play. (PR #264.)
- On phones the home page top is one 44px row; the child chip in every page opens "Who is playing?" with two or more children. Once a switch starts nothing is saved until the reload, so a late timer never writes under the wrong child. (PRs #271 and #278.)

### Safety
- No outside requests. No `style=` attributes, no `on*=` handlers (a hook blocks them). `tools/csp.py` and `tools/check_external.py` must pass.
- Saved data is never lost or reset: a changed key or format needs a migration, and old stars codes still import. Per-child data goes through `Loopy.store`. Validate everything read from storage. (Owner's rule, 16 Oct 2026.)

### Every change
- Look for speed and size wins (loopy.js size, work on load, what is saved, page size, fonts, sw.js cache, Lighthouse) and say in the PR what was found, or that nothing was. (16 Oct 2026.)
- Every pull request that changes what a page looks like first runs the improve-ui skill on that page (`/improve-ui <page>`): it checks the page against DESIGN.md and reports proven design problems. Fix the findings in the same PR or say in the PR why not. (Owner's rule, 1 Nov 2026.)
- Use the repo's own improve-ui copy (`plugins/loopy/skills/improve-ui`, it ends with the In loopy section and works in the cloud too), not a global skill of the same name. On the owner's Mac, impeccable and the rest of ui-skills are also installed globally; `/impeccable critique <page>` is a good second opinion, under the same loopy rules (no `style=`, no outside requests, edits in `src/`).
- Review with the loopy-review skill, run `tools/review.py`, the type check `node tools/build/node_modules/typescript/bin/tsc -p tools/build`, the play test `node tools/e2e/play.mjs` (CI also runs it and the accessibility check with `ENGINE=webkit`, Safari's engine; run that too when a change touches layout or anything Safari does differently), the Try again test `node tools/e2e/retry.mjs`, the levels test `node tools/e2e/levels.mjs`, the switch test `node tools/e2e/switch.mjs`, the first visit test `node tools/e2e/hello.mjs` and the accessibility check `node tools/a11y/check.mjs`.
- The picture test (`node tools/e2e/pictures.mjs`) keeps the home page and six games looking the same at three sizes, English and German, against `tools/e2e/pictures/`. When a change is meant to look different, refresh the saved pictures with the label "refresh pictures" on the pull request (the Refresh pictures workflow takes them with the pinned Chromium build the check uses and commits them), or Actions → "Refresh pictures" with the branch. Never loosen the compare.
- The styles are linted: `node tools/lint/check.mjs` (Stylelint over `src/loopy.css`, `src/print.css` and every page's `<style>` block, `tools/lint/stylelint.config.json`) allows only CSS every current browser has (Baseline newly available) and no broken or doubled declarations; CI runs it in the fast `checks` job. A new CSS feature that is not Baseline yet needs a fallback that works without it, not an ignore entry.
- CodeRabbit reviews every pull request against the loopy rules (`.coderabbit.yaml`); read its comments before the PR is marked ready, fix what is right, answer what is not. Its comments are a second opinion, never the owner's approval.
- Budgets are checks: `python3 tools/review.py --budget` (a page sends at most 100 KB; `loopy.js` and `loopy.css` grow by at most 2 KB per pull request; a line "Size budget: <why>" in the PR body allows more on purpose) and Lighthouse on the pages a change touches (`tools/lighthouse/lighthouserc.json`: every score 95 or more, no layout shift; its 100 KB size line is a warning, because Lighthouse also counts headers, icon, manifest and the lazy parts). A red budget means make it smaller, not raise the number.
- When a bug is about layout, speed or the console, use the browser tools in `.mcp.json` where they are available (Chrome DevTools MCP: a real Chrome with a performance trace, console, network and accessibility tree; Playwright MCP: the same in WebKit and Firefox) before guessing from the source.
- Every game logs a short rebuild note with each wrong answer and asks for its questions through `Loopy.retry.fresh`, so a mistake comes back (Try again). `tools/e2e/retry.mjs` checks it.
- Docs keep up: every change people can see or use also updates the docs that describe it, in the same PR. That is the guide (EN + DE), FAQ.md, the Help page, game READMEs, the main README and RELEASES.md. Plain English: short sentences, simple words, child and parent friendly. Use the loopy-docs skill; `tools/review.py` warns about missed docs. (Owner's rule, 21 Oct 2026.)
- Each game has its own README. After a major merge add a parent-friendly row at the top of RELEASES.md.
- Pull requests use `.github/pull_request_template.md`, with before and after screenshots when the screen changes.

### Roadmap
- GitHub issues, order in issue #21. "Start next", "Take next task", "Pickup next task", "take next 3 tasks", "Build #N" mean: build the next open issue(s) in that order, open a PR against main, close the issue on merge.
- Claude cannot change GitHub repo settings or open github.io. Give the owner exact steps, or ask them to check the live site.
