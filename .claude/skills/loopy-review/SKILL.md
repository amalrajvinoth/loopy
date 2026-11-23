---
name: loopy-review
description: Review a loopy change before its pull request is ready. Checks, the screen, saved data, speed, docs and consistency, with a fix for each finding. Use for "review", and after a merge.
---

# loopy review

Use this on every loopy change before a pull request is opened or marked ready, when asked to "review", and after a pull request merges.

The rules are not repeated here. They are AGENTS.md (Site, Games, Safety), DESIGN.md "7. Do and don't" for the look, and the README "For developers". Read DESIGN.md first if you have not in this session. This skill is how to check a change against them.

## 1. Find the change

```sh
git fetch origin main
git diff --stat origin/main...HEAD
git diff origin/main...HEAD
```

Note the kind: a new game, a change to one game, shared code (`src/`), docs only, or tooling and CI. It decides which pages in step 3 to read.

## 2. Run the checks

`python3 tools/check.py` runs the checks this change needs and says why a red one matters. Any red one must be fixed.

`tools/review.py` (one of them) prints `must`, `should` and `suggest` rows, compared with the point where the branch left `origin/main` (`--base <ref>` for another branch): saved keys nothing reads any more, docs the change may have missed (rows that start with `docs`), names taken out of the OLD list, direct `localStorage` use in a page, new places that remove saved data, and a size table of every file that changed. A `must` this change added must be fixed. A finding that was already on main goes in the report as "already there".

## 3. Read the pages this change needs

Each is a file next to this one. Read only the ones that fit.

| The change touches | Read |
| --- | --- |
| A page, `src/loopy.css`, `src/loopy.js`, or anything that prints | `screen.md` |
| Anything saved: a key or its format, `Loopy.store`, `localStorage`, stars codes, levels, the child list | `saved-data.md` |
| A page, `src/`, or a file a page loads | `speed.md` |
| It has merged | `release-notes.md` |

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

## 5. Consistency between games

Every game should work the same way where it can. Compare the changed game with the others and with `tools/review.py`: same shared parts, same Settings order, same Reset score behaviour, same README sections and names, same way of explaining an answer, Print worksheet in Settings, keyboard support. If one game does something differently and there is no good reason, that is a finding.

## 6. Docs

Every change people can see or use updates its docs in the same pull request. The loopy-docs skill says which docs and how to write them. A doc that is out of date, in one language only, or hard to read is a **Should fix**.

## 7. Report

Write the report as one table, most serious first. Do not change anything the person did not ask for: list it as a suggestion instead.

| Level | Where | What is wrong | Suggested fix |
| --- | --- | --- | --- |
| Must fix | `math/x/index.html:120` | ... | ... |
| Should fix | ... | ... | ... |
| Suggestion | ... | ... | ... |

- **Must fix:** breaks a check, a security rule, both languages, one screen, or another game, or loses or resets anything a child has saved.
- **Should fix:** differs from DESIGN.md or the other games, docs are out of date, or a file grows past the size limits in `speed.md`.
- **Suggestion:** a deviation that might be on purpose, or a small improvement. Say why it might matter.

Then a short "Checked" list: the checks you ran, the screen sizes, themes, languages, print preview, the saved data test, and the size table from `tools/review.py`. If there are no findings, say so in one line.

Fix every "Must fix" in this change before the pull request is marked ready. Ask before acting on "Should fix" items that are outside the change.
