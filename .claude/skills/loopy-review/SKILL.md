---
name: loopy-review
description: Review every loopy change before its PR is ready, and write release notes when a major change merges. Checks the UI against DESIGN.md, architecture, saved data (nothing a child has is lost), speed and size, docs and consistency between games, and suggests fixes for anything that differs.
---

# loopy review

Use this on every change to loopy: before you open or mark a pull request ready, when asked to "review", and again after a pull request merges.

The project rules live in the README ("For developers"), DESIGN.md, CONTRIBUTING.md and SECURITY.md. This skill checks a change against them. Read DESIGN.md first if you have not read it in this session.

## 1. Find the change

```sh
git fetch origin main
git diff --stat origin/main...HEAD
git diff origin/main...HEAD
```

Note which kind of change it is: new game, change to one game, shared code (`src/`), docs only, or tooling and CI. Every step below still runs, but a docs-only change can skip the screenshots.

## 2. Run the checks

```sh
python3 tools/build.py --check      # loopy.js, loopy.css and sw.js match src/
python3 tools/csp.py --check        # every page's security policy is up to date
python3 tools/check_external.py     # nothing loads from another website
python3 tools/review.py             # games follow the same rules, saved data is kept, sizes (table of findings)
node tools/e2e/play.mjs             # plays every game; no errors, stars add up, no repeated questions
node tools/e2e/retry.mjs            # Try again in every game: a mistake comes back, and goes once it is answered right twice
node tools/e2e/levels.mjs           # levels follow the child: up by itself when ready, kept over the birthday
node tools/e2e/switch.mjs           # switching the child mid-game: each child keeps their own stars, log and last game
```

The play test also checks four rules from bug reports, so a change that breaks one fails here first: a day counts only when Today's 10 is finished, never for 10 right answers in another game (PR #269); every note and coin on screen shows its € sign and the Class Test money hint names only what is on the card (PR #274); in the eight word games loopy's language wins over an old "Words in" pick (PRs #292 and #296); and the switch test proves that nothing is saved under the wrong child after a sibling takes over mid-game (PR #278). The heal skill's recipes name each failure's text.

The first three, the play test and the Try again test are the GitHub check: any failure must be fixed (the play test needs `npm ci --prefix tools/a11y --ignore-scripts` once, see tools/e2e/README.md). `tools/review.py` prints `must`, `should` and `suggest` findings. A `must` that this change added must be fixed. Findings that were already on main go in the report as "already there", not as part of this change.

`tools/review.py` compares the change with the point where it left `origin/main` (use `--base <ref>` for another branch). It finds saved keys that nothing reads any more, docs this change may have missed (rows that start with `docs`), names taken out of the OLD list, direct `localStorage` use in a page, new places that remove saved data, and files that got bigger. It prints a size table for every file that changed size. Run `git fetch origin main` first, so the comparison is with the real main.

## 3. UI against DESIGN.md

Only when a page, `src/loopy.css` or `src/loopy.js` changed. Serve the site (`python3 -m http.server 8000`) and take Playwright screenshots of every changed page at the eight sizes in DESIGN.md "Screens": 360 × 640, 390 × 844, 430 × 932, 844 × 390, 820 × 1180, 1180 × 820, 1280 × 800, 1920 × 1080. Look at them. Also check the Black theme and one light theme (Sunny), and German.

Check:

- **One screen.** A game never scrolls with Settings closed, in portrait or landscape. The pad or answers stay at the bottom in portrait. Nothing is cut off either: look at the card fresh, after a wrong answer with the longest explanation, and with Settings open, at all eight sizes. The tablet held upright is where a big element overflows first (the Plus and Minus sum did, PR #276): a sum, grid or picture that grows with the screen is capped by the card's height in container units, up to `--big`, never by a fixed number.
- **The main content fills the card.** On a tablet, a laptop or a monitor the sum, the letter grid, the text or the picture grows to the room the card has, in container units with a cap. A card that is mostly empty around small content is a finding (Word Detective and Read and Answer were, PR #266). A page that measures text to pick its size runs the fit again when the web font lands (`document.fonts.ready`), or a small phone can still scroll.
- **Nothing dead, nothing covered.** A button that does nothing is never on screen: Next shows only after an answer, and where a game has no Skip its place stays empty until then, so the answers do not jump (`#next:disabled`). The first-time hint bubble covers no key, number, word or button, and names the game's real first tap ("Tap 🔊 to hear the word, then spell it!" in My Words). The feedback word is the shared one, "Correct!" and "Not quite." through `Loopy.t()`, in every game. (PR #273 fixed ten games for these three.)
- **A helper line says what is on the card.** A hint under the question names only what the child can see: "Notes first, then the coins" only when both are on the card. Every note and coin shows its currency sign, so money never looks like a plain number card. A picture a game borrows from another game (Class Test from Is It Enough?) keeps that game's colours, lines and sizes. (PR #274.)
- **Pretend is said out loud.** When a question assumes something that is not true right now, the screen says so in the question ("Pretend it is afternoon"), a badge shows it, and Read aloud says it first. The 24-hour level of What Time Is It? does this (PR #288); a bug report that a right 24-hour answer "seems wrong" is this, not a child's slip. Any new level that fixes a day, a date, a season or a price does the same.
- **A grown-up's list is the only source.** With a word list a grown-up gave, a game shows no picture that has nothing to do with those words (no bee in Spelling Quiz), the meaning comes only from the list (never a lookup, never an outside request), and Try again replays only words that are still in play (PR #264).
- **Colors.** Theme variables only (`--bg`, `--card`, `--ink`, `--c1`...). Green and red only mean right and wrong. Yellow only for rewards and Today's 10. Printed sheets are the one exception: black on white.
- **Type.** Fredoka for headings, Lexend for text. No new fonts. The one exception is Atkinson Hyperlegible Next, used everywhere only when "Easier to read" is on.
- **Shared parts.** Back button, star counter, Last 5, the child chip (`<div id="kid-picker">`, which opens the "Who is playing?" sheet with two or more children), ⚙ Settings with age, theme, sound and language, Reset score. They look the same as in the other games. On the home page the top is one 44px row on phones (PR #271); with three or more children it must not push the first game tiles off a 360 × 640 screen.
- **Touch.** Tap targets at least 44px. Focus ring with `:focus-visible`. `prefers-reduced-motion` turns movement off. No hover-only effects.
- **Words.** Lowercase "loopy" on screen. Every word in English and German. Numbers through `Loopy.num()`.
- **German all the way.** Switch loopy to German and play 12 rounds with wrong answers: nothing on screen stays English (prompts, keys, hints, the explanation, Settings, the Try again card). Compare the `en` and `de` key sets of every `Loopy.addStrings` on the page (they must match), and look for HTML text without `data-t`. A quick way: render the page in both languages at 390 × 844 and list the words both renders share; those are the suspects.
- **Words in follows loopy's language.** In a word game with a "Words in" pick (Word Detective, Spell It, Spelling Quiz, My Words, Sound Spell, Word Match, Word Trail, Sentence Builder): pick English words, then switch loopy to German and reload. The words, clues and keyboard must be German. A pick is remembered only with the loopy language it was made under (`<game>.words` + `<game>.wordsUi`, see PRs #292 and #296); a new pick must use the same pattern. `tools/e2e/play.mjs` checks the eight games (`wordsFollowLanguage`, `wordDetectiveWords`).
- **German keyboard.** When the words are German, the keys are German: the qwertz rows `qwertzuiopü`, `asdfghjklöä`, `yxcvbnmß`, and a letter pad mixes ä, ö and ü into its extras (`EXTRA.de`). Check at 360 × 640 that the longest row fits with the extra key, that "Löschen" and "Prüfen" are not cut off, and that ß shows as ß, not "SS" (keys in uppercase need `text-transform: none` on that key). `tools/review.py` flags qwertz rows without ü, ö, ä, ß and `EXTRA.de` without umlauts.
- **Home screen app.** When loopy is added to the home screen there are no browser bars, and on Android the app is drawn under the gesture bar. A page never reads `env(safe-area-inset-top/bottom)` itself: it uses `var(--safe-top)` and `var(--safe-bottom)` from `src/loopy.css`, which keep a floor in the home screen app (`tools/review.py` flags raw `env()`). To test in headless Chromium: open a CDP session and send `Emulation.setSafeAreaInsetsOverride` with `insets: { top, topMax, bottom, bottomMax, left, leftMax, right, rightMax }` (try a reported bottom of 0, 24 and 48px at 412 × 915, 47/34px at 390 × 844 for an iPhone, 24/20px at 820 × 1180 for an iPad). Chromium cannot emulate `display-mode: standalone`, so make the context with `bypassCSP: true` and inject the standalone rule from `loopy.css` with `addStyleTag`. Then the lowest element on the page (keys, answers, the hint bubble, a scrolling page's last line) must end above `innerHeight` minus the bar. The before and after pictures for PR #295 were made this way.
- **Security.** No `style=` attributes, no `on...=` handlers, no outside requests.
- **Print.** If the change touches a game or the worksheet code, print-preview the worksheet (`page.emulateMedia({ media: "print" })` and `page.pdf()` for A4 and Letter). It must be exactly 2 pages. Anything that prints (worksheet, weekly card, a printed page, any new print) must show the real loopy logo (`Loopy.logo()`) in a fitting place; a missing logo is a Must fix (owner's rule, 20 Oct 2026).

Compare with the same screens on main, so you can say what looks different.

## 4. Architecture

Look for these problems in the diff. Each one is a finding.

- Shared behaviour copied into a page instead of living in `src/loopy.js` / `src/loopy.css`, or a game that copies another game's code where a shared helper already exists (`Loopy.worksheet`, `Loopy.rewards`, `Loopy.log`, `Loopy.recent`).
- A new shared script or stylesheet. There must be only `loopy.js` and `loopy.css`.
- Edits to the built `loopy.js` / `loopy.css` instead of `src/`.
- Anything read from `localStorage` (or a pasted code) used without checking it first.
- Anything sent or loaded from outside the site.
- A game that ignores the age, or keeps its own copy of the age rules that will drift from the game it copies (Today's 10 copies the games' rules on purpose; keep both in step).
- A change to one game that changes how another game plays or looks.
- Code that is hard to follow for the next person: long functions with no comment saying what they do, names that hide what a value means.

## 5. Saved data

Children keep their stars, streaks, levels and settings in their own browser. Nobody can get them back if a change loses them. So every change must keep what is saved today working, on every device that already has it.

What is saved today:

- **Per child** (through `Loopy.store`, kept as `loopy.kid.<id>.` + key): `loopy.rewards`, `loopy.daily`, `loopy.log`, `loopy.recent`, `loopy.ageOffset`, `loopy.readAloud`, `loopy.seen`, and each game's settings (`pm100.`, `ts.`, `clockquiz.`, `ss.`, `mk.`, `bs.`, `pz.`, `cc.`, `wm.`, `si.`, `wi.`, `qf.`, `eb.`, `fc.`).
- **For the whole device**: `loopy.kids` (the children), `loopy.lang`, `loopy.theme`, `loopy.font`, `loopy.sound`.
- **Moved on a first visit**: keys from before there were children (the OLD list in `src/loopy.js`) move to child 1.
- **Stars code** (`Loopy.backup`): any code made before must still load.

Check:

- **No key is dropped or renamed without a move.** If a key or its format changes, read the old one, turn it into the new one, save it and then remove the old one. Do it once, on load, and keep the step in the code for good: some devices only come back months later.
- **Formats only grow.** A new field gets a default when it is missing. An old value that does not fit the new rules is cleaned (like `clean()` does), not thrown away with everything else.
- **Nothing is reset by surprise.** Only Reset score, removing a child, or the person's own choice may remove saved data. A new feature that changes levels or settings starts from what the child already chose.
- **A day is Today's 10.** The day streak and the day badges count a day only when Today's 10 is finished (`Loopy.daily.finish()`, called by Today's 10 alone). Right answers in another game earn stars, never a day, and `Loopy.rewards.correct` does not touch `Loopy.daily` (PR #269 removed that path). A day counted the old way stays counted.
- **Nothing is saved after a switch.** When a sibling takes over mid-game, `Loopy.kids.use` sets a guard and `Loopy.store` drops every save until the reload. A timer still running in the game (a round clock, a level ask) must never write the old child's numbers under the new child's key. A change to `Loopy.store`, `Loopy.kids`, the child chip or the sheet runs `node tools/e2e/switch.mjs` (PR #278).
- **Per child or per device.** Anything that belongs to one child uses `Loopy.store`. Only display settings are for the whole device.
- **Validate on read.** Every value read from storage, a stars code or a link is checked before use. Broken or old data falls back to a default, never to an error.
- **Stars code both ways.** An old code still loads on the new version. A new code still loads, or fails kindly, on a device that has the old version. If a new key holds progress, add it to `Loopy.backup`.
- **Test it.** Before the change, play on main and make some stars, a streak, a level and a setting for two children. Switch to the change and reload: everything must still be there. Also load a stars code made on main.

If storage moves (for example to IndexedDB), keep reading localStorage until the move is done, move once, keep the old copy until the new one is saved, and still work when the new storage is blocked (private windows).

## 6. Speed and size

Always look for a chance to make loopy faster or smaller, even if the change is not about speed. List what you find as a suggestion, with the size or time it saves.

- **Code.** `loopy.js` and `loopy.css` load on every page, so every byte counts many times. Code that only one page uses belongs in that page. Remove code nothing calls. Do no work on load that can wait until it is needed (the "Easier to read" font only loads when that setting is on). No timers or animation loops that run when nothing moves. Read and parse saved data once, not on every answer.
- **Memory.** Keep what is saved small and capped: a list grows only to a fixed size or number of days (like `loopy.log`, 30 days). Save only what is needed to play on, not whole questions or pictures. Do not keep big lists in memory after they are used.
- **Delivery.** Pages stay small: `tools/review.py` flags a page over 100 KB sent (with `loopy.js`, `loopy.css` and fonts), `loopy.js` or `loopy.css` growing by more than 1 KB, a page growing by more than 2 KB, and the offline copy growing by more than 50 KB. No new fonts; letters outside the font subset use the device font. Pictures are SVG or small PNGs. The offline helper (`sw.js`) must not cache what a page never uses. Preload only the font the first screen needs.
- **Lighthouse.** For a change to a page or shared code, run Lighthouse (phone, slow 4G) on a home page and one changed page with a server that compresses like GitHub Pages. Performance should stay at 100. If the README size table is out of date, update it.

## 7. Docs

Every change people can see or use updates its docs in the same pull request: the guide (English and German), FAQ.md, the Help page, the game's README, the main README and RELEASES.md (owner's rule, 21 Oct 2026). Follow the **loopy-docs** skill (`.claude/skills/loopy-docs/SKILL.md`). It maps each kind of change to the docs and guide pages it touches, and says how to write them in plain English. The `docs` rows from `tools/review.py` are warnings: fix them, or say in the PR why a doc did not need to change.

In short:

| Changed | Update |
| --- | --- |
| A game's play, levels or settings | That game's README.md |
| A new game | Its README.md (How to play, age levels, Settings, Print a worksheet, example help text), a row in README.md "The games", one line in the home page GAMES list |
| How something looks | DESIGN.md (component, colors, layout or screens) |
| Shared code or tools | README.md "For developers" and the comment at the top of the block in `src/loopy.js` |
| Something a parent would ask about | FAQ.md, the Help page and the guide's FAQ page (all in both languages) |
| Anything a child or grown-up will notice | The guide pages about it, in English and German, and a RELEASES.md row with the same news in the guide's What's new page |

Docs are plain, short-sentence English: short sentences, everyday words, no code words, buttons named the way the screen shows them. A doc that is out of date, in one language only, or hard to read is a **Should fix**.

## 8. Consistency between games

Every game should work the same way where it can. Compare the changed game with the others and with `tools/review.py`: same shared parts, same Settings order, same Reset score behaviour, same README sections and names, same way of explaining an answer, Print worksheet in Settings, keyboard support. If one game does something differently and there is no good reason, that is a finding.

## 9. Report

Write the report as one table, most serious first. Do not change anything the person did not ask for: list it as a suggestion instead.

| Level | Where | What is wrong | Suggested fix |
| --- | --- | --- | --- |
| Must fix | `math/x/index.html:120` | ... | ... |
| Should fix | ... | ... | ... |
| Suggestion | ... | ... | ... |

- **Must fix:** breaks a check, a security rule, both languages, one screen, or another game, or loses or resets anything a child has saved.
- **Should fix:** differs from DESIGN.md or the other games, docs are out of date, or a file grows past the size limits in step 6.
- **Suggestion:** a deviation that might be on purpose, or a small improvement. Say why it might matter.

Then a short "Checked" list: the checks you ran, the screen sizes, themes, languages, print preview, the saved data test, and the size table from `tools/review.py`. If there are no findings, say so in one line.

Fix every "Must fix" in this change before the pull request is marked ready. Ask before acting on "Should fix" items that are outside the change.

## 10. Release notes after a merge

After a pull request merges into main, decide if it is a **major** change:

- Major: a new game or page, a new feature people can see or use, a change to how a game plays or looks, a change to what is saved.
- Not major: typo or docs-only fixes, refactors nobody can see, CI and tooling, dependency bumps.

For a major change, add one row at the **top** of the table in `RELEASES.md`, and the same news in the guide's `help/whats-new.md` (English and German), and open a small pull request for it (or add it to the next pull request if one is open). Write it for parents, not developers:

| Date | What's new | Where | PR |
| --- | --- | --- | --- |
| 2026-10-15 | Print a worksheet: 20 problems at your child's level, with an answer page. | Plus and Minus, Times and Share, What Time Is It?, Sound Spell | #30 |

- **Date:** the merge date, YYYY-MM-DD.
- **What's new:** one or two short sentences. What can a child or grown-up do now? No code words.
- **Where:** the games or pages it touches.
- **PR:** the pull request number, as `#N`.

Use lowercase "loopy" if it appears. Do not add Claude attribution anywhere.
