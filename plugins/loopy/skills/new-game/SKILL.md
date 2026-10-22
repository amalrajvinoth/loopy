---
name: new-game
description: Set up a new loopy game in all the places it must be listed. Use when building a new game, or "add a game", "new game for X".
---

# New game

A game id has to be in several lists. Missing one breaks stars, the progress page or the home page quietly. `tools/review.py` catches most of them; do them all up front.

1. **Folder:** `<subject>/<game>/index.html` (subjects today: math, languages, science, geography, mix). Copy the shape of the closest existing game: shared header (`Loopy` back button, star counter, Last 5, ⚙ Settings, report flag), the problem card, answers at the bottom in portrait, two columns in landscape.
2. **Game id** (short, kebab-case) in:
   - all the `GAMES = [` lists in `src/loopy.js` (rewards, log, recent; `drift.py` tracks how many there are);
   - the `GAMES` list in `progress/index.html`, with a name string;
   - the home page `GAMES` list in `index.html`, added **last in its subject** so other card colors do not shift.
3. **Words:** `Loopy.addStrings({en: {...}, de: {...}})` for every word, `data-t` / `data-t-aria` in the markup, numbers through `Loopy.num()`. German name agreed in the issue or chosen and said in the PR.
4. **Play:** difficulty from `Loopy.getAge()`, and the `loopy:age` event resets the round when the age changes, questions through `Loopy.fresh(recent, make)` with a key per question (no repeat within 10), `Loopy.rewards.correct()` / `.wrong(game, {q, a, y, k})`, log kinds added to the `KIND` regex in `src/loopy.js` and a `tip-<kind>` string (EN and DE) in `progress/index.html`.
5. **Saved settings:** through `Loopy.store.get/set` with keys `<prefix>.<setting>`, never `localStorage` directly. Add the new prefix to `GKEY` in the stars code block of `src/loopy.js`, so the settings move with the stars code.
6. **Extras the other games have:** Read aloud (`Loopy.speech.question`), a printable worksheet (`Loopy.worksheet`), Settings in the same order as the other games, keyboard support.
7. **Docs:** `<game>/README.md` (How to play, Age levels, Settings, Print a worksheet, example help text) and a row in README.md "The games".
   **Guide:** a page in English and German, `guide-src/src/content/docs/games/<subject>/<game>.mdx` and the same under `de/`, plus a line in `guide-src/src/games.ts`, then `npm run screens --prefix guide-src` for its pictures (see guide-src/README.md). `tools/guide_check.py` fails without them. Write them with the loopy-docs skill (plain English, a RELEASES.md row and What's new).
8. Then `python3 tools/build.py` and the `ship-pr` skill. The play test (`tools/e2e/play.mjs`) and the Try again test (`tools/e2e/retry.mjs`) pick the new game up by themselves; the game must log a rebuild note with each wrong answer and ask for questions through `Loopy.retry.fresh` (see the README's "Build a game").
