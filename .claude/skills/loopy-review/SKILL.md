---
name: loopy-review
description: Review every loopy change before its PR is ready, and write release notes when a major change merges. Checks the UI against DESIGN.md, architecture, docs and consistency between games, and suggests fixes for anything that differs.
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
python3 tools/build.py --check      # loopy.js and loopy.css match src/
python3 tools/csp.py --check        # every page's security policy is up to date
python3 tools/check_external.py     # nothing loads from another website
python3 tools/review.py             # games follow the same rules (table of findings)
```

The first three are the GitHub check: any failure must be fixed. `tools/review.py` prints `must`, `should` and `suggest` findings. A `must` that this change added must be fixed. Findings that were already on main go in the report as "already there", not as part of this change.

## 3. UI against DESIGN.md

Only when a page, `src/loopy.css` or `src/loopy.js` changed. Serve the site (`python3 -m http.server 8000`) and take Playwright screenshots of every changed page at the five sizes in DESIGN.md "Screens": 360 × 640, 390 × 844, 844 × 390, 820 × 1180, 1180 × 820. Look at them. Also check the Black theme and one light theme (Sunny), and German.

Check:

- **One screen.** A game never scrolls with Settings closed, in portrait or landscape. The pad or answers stay at the bottom in portrait.
- **Colors.** Theme variables only (`--bg`, `--card`, `--ink`, `--c1`...). Green and red only mean right and wrong. Yellow only for rewards and Today's 10. Printed sheets are the one exception: black on white.
- **Type.** Fredoka for headings, Lexend for text. No new fonts. The one exception is Atkinson Hyperlegible Next, used everywhere only when "Easier to read" is on.
- **Shared parts.** Back button, star counter, Last 5, ⚙ Settings with age, theme, sound and language, Reset score. They look the same as in the other games.
- **Touch.** Tap targets at least 44px. Focus ring with `:focus-visible`. `prefers-reduced-motion` turns movement off. No hover-only effects.
- **Words.** Lowercase "loopy" on screen. Every word in English and German. Numbers through `Loopy.num()`.
- **Security.** No `style=` attributes, no `on...=` handlers, no outside requests.
- **Print.** If the change touches a game or the worksheet code, print-preview the worksheet (`page.emulateMedia({ media: "print" })` and `page.pdf()` for A4 and Letter). It must be exactly 2 pages.

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

## 5. Docs

Check each one that the change affects, and update it in the same pull request:

| Changed | Update |
| --- | --- |
| A game's play, levels or settings | That game's README.md |
| A new game | Its README.md (How to play, age levels, Settings, Print a worksheet, example help text), a row in README.md "The games", one line in the home page GAMES list |
| How something looks | DESIGN.md (component, colors, layout or screens) |
| Shared code or tools | README.md "For developers" and the comment at the top of the block in `src/loopy.js` |
| Something a parent would ask about | FAQ.md and the Help page (both languages) |

Docs are plain, short-sentence English.

## 6. Consistency between games

Every game should work the same way where it can. Compare the changed game with the others and with `tools/review.py`: same shared parts, same Settings order, same Reset score behaviour, same README sections and names, same way of explaining an answer, Print worksheet in Settings, keyboard support. If one game does something differently and there is no good reason, that is a finding.

## 7. Report

Write the report as one table, most serious first. Do not change anything the person did not ask for: list it as a suggestion instead.

| Level | Where | What is wrong | Suggested fix |
| --- | --- | --- | --- |
| Must fix | `math/x/index.html:120` | ... | ... |
| Should fix | ... | ... | ... |
| Suggestion | ... | ... | ... |

- **Must fix:** breaks a check, a security rule, both languages, one screen, or another game.
- **Should fix:** differs from DESIGN.md or the other games, or docs are out of date.
- **Suggestion:** a deviation that might be on purpose, or a small improvement. Say why it might matter.

Then a short "Checked" list: the checks you ran, the screen sizes, themes, languages and print preview. If there are no findings, say so in one line.

Fix every "Must fix" in this change before the pull request is marked ready. Ask before acting on "Should fix" items that are outside the change.

## 8. Release notes after a merge

After a pull request merges into main, decide if it is a **major** change:

- Major: a new game or page, a new feature people can see or use, a change to how a game plays or looks, a change to what is saved.
- Not major: typo or docs-only fixes, refactors nobody can see, CI and tooling, dependency bumps.

For a major change, add one row at the **top** of the table in `RELEASES.md` and open a small pull request for it (or add it to the next pull request if one is open). Write it for parents, not developers:

| Date | What's new | Where | PR |
| --- | --- | --- | --- |
| 2026-10-15 | Print a worksheet: 20 problems at your child's level, with an answer page. | Plus and Minus, Times and Share, What Time Is It?, Sound Spell | #30 |

- **Date:** the merge date, YYYY-MM-DD.
- **What's new:** one or two short sentences. What can a child or grown-up do now? No code words.
- **Where:** the games or pages it touches.
- **PR:** the pull request number, as `#N`.

Use lowercase "loopy" if it appears. Do not add Claude attribution anywhere.
