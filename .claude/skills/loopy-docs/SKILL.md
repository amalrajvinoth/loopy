---
name: loopy-docs
description: Keep loopy's docs up to date in the same pull request, in plain English. Use on every change people can see or use, and for "update the docs", "update the guide", "update the FAQ", "write release notes". Finds which docs a change touches (guide EN and DE, FAQ.md, Help page, game README, main README, RELEASES.md) and how to write them.
---

<!-- Copied from plugins/loopy/skills/loopy-docs/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Keep the docs up to date

Every change that alters what a child or grown-up sees or does also updates the docs that describe it, in the same pull request. The owner asked for this on 21 Oct 2026. A doc that says something the site no longer does is a bug.

## 1. Find what changed

```sh
git fetch origin main
git diff --stat origin/main...HEAD
python3 tools/review.py        # the "docs" rows say which docs this change may have missed
```

Ask one question about the change: **will a child or a grown-up notice it?** For example: a new button, new words on screen or a new setting. Or a game that plays differently, a new level, a print that looks different, or a fix for something people saw. If yes, the docs change too. If nobody will notice (a refactor, CI, tests, tooling), write "Docs: nothing people see changed" in the pull request and stop here.

## 2. Find the docs it touches

Guide pages live in `guide-src/src/content/docs/`. Every English page has a German twin with the same name under `docs/de/`. **Always change both.**

| What changed | Docs to update |
| --- | --- |
| A game (`<subject>/<game>/`) | `<subject>/<game>/README.md`. Guide `games/<subject>/<game>.mdx` (EN + DE). The row in README.md "The games" if the name, ages or idea changed. |
| A game's levels | The game's README "Age levels". Its guide page "Age levels". Guide `grown-ups/levels-ladder.md`. |
| A game looks different | `npm run screens --prefix guide-src` for new guide pictures. Before and after pictures in the PR. |
| Today's 10 (`mix/daily-mix/`) | `mix/daily-mix/README.md`. Guide `games/todays-10.mdx`. |
| A new game | Everything in the `new-game` skill, step 7. Also a FAQ answer if a parent would ask about it. |
| Home page (`index.html`) | Guide `start/first-minutes.mdx`, `settings/home-settings.mdx`. |
| Parts every game shares (header, ⚙, Last 5, 🚩) | Guide `playing/game-screen.mdx`, `settings/game-settings.mdx`. |
| Stars, streaks, badges | Guide `playing/stars-and-badges.mdx`. |
| Levels (`src/loopy-levels.js`) | Guide `playing/levels.md`, `grown-ups/levels-ladder.md`. |
| Try again | Guide `playing/try-again.md`. |
| Children, ages, "Who is playing?" | Guide `setup/kids-and-ages.md`. |
| Themes, language, "Easier to read" | Guide `setup/language-and-look.mdx`. DESIGN.md if the look changed. |
| Add to home screen (`src/loopy-install.js`) | Guide `setup/home-screen.md`. |
| Offline copy (`src/sw.js`) | Guide `setup/offline.md`, only if people notice it. |
| Stars code, QR, backup file (`src/loopy-backup.js`) | Guide `stars/move-stars.mdx`, `stars/backup-file.md`, `stars/where-stars-live.md`. |
| Grown-ups page (`progress/`), weekly card | Guide `grown-ups/grown-ups-page.mdx`. |
| Worksheets, practice sheet (`src/loopy-sheet.js`, print) | Each game's "Print a worksheet" in its README. Guide `grown-ups/practice-sheet.md`. |
| Report a problem (`src/loopy-report.js`) | Guide `help/report-a-problem.mdx`. |
| Safety, privacy, what is saved | SECURITY.md. Guide `start/is-it-safe.md`, `help/security.md`. |
| Something a parent would ask about | FAQ, see below. |
| Shared code or tools | README.md "For developers". The comment at the top of the block in `src/loopy.js`. |
| Anything people will notice | A row at the top of RELEASES.md and the guide `help/whats-new.md` (EN + DE). See below. |

Not sure which guide page? Search for the words on the screen:

```sh
grep -rln "Try again" guide-src/src/content/docs --include="*.md*"
```

### The FAQ lives in three places

Keep them saying the same thing:

1. `FAQ.md`
2. The Help page, `help/index.html`: strings `q1`/`a1`, `q2`/`a2`... in both `en` and `de`. The loop under the strings shows `q1` to `q20`. Raise that number when you add a question.
3. The guide, `help/faq.md` (EN + DE).

A changed answer changes in all three, in both languages.

### Release notes

For a change people will notice, add one row at the **top** of the table in RELEASES.md: date (YYYY-MM-DD), what is new, where, PR number. Add the same news, shorter, at the top of the guide's `help/whats-new.md` in English and German. Put it under a heading with the date: "21 October 2026", in German "21. Oktober 2026". The loopy-review skill, step 10, says what counts as a change people notice.

## 3. Write it in plain English

Docs are read by parents, teachers and kids. Many read on a phone, many in their second language.

- **Lead with what people can do.** "Pick the right spelling out of 3." Not "This game presents a multiple-choice spelling task."
- **Short sentences.** One idea each. Aim for 15 words, never more than 25.
- **Everyday words.** "use" not "utilise", "start" not "initiate", "about" not "approximately", "for example" not "e.g.", "so" not "therefore", "help" not "facilitate".
- **No code words** in the guide, FAQ, Help page or RELEASES.md. No "localStorage", "service worker", "toggle", "modal", "component", "cache". Say "saved in this browser", "works offline", "button", "box".
- **Name buttons the way the screen does**, in **bold**: **Check**, **Next**, ⚙ **Settings**. In German pages, use the German words from the game's `de` strings.
- **Say "you" and "your child".** German pages say "du", like the games.
- **Active voice.** "Tap **Check**." Not "The answer is checked when **Check** is tapped."
- **Lowercase "loopy"** on the site, the Help page and the guide. Repo docs (README, FAQ.md) may say "Loopy" at the start of a sentence.
- **Numbers as digits.** "3 tries", "ages 6 to 12".
- **Only write what the site really does.** Check the code or play the game when unsure.
- **Short release rows.** One or two sentences: what is new and what a child can do now. Not every detail.

The **For kids** box on a guide game page has 3 steps of up to 10 easy words. A 7-year-old should be able to read it alone.

**German** is real German, not word-for-word English. Same facts, same buttons, same order of sections as the English page.

### Before and after

| Hard to read | Plain |
| --- | --- |
| Utilising the configuration panel, guardians may adjust the difficulty parameters. | Grown-ups can change the level in ⚙ **Settings**. |
| Progress is persisted locally via browser storage and is not transmitted. | Stars stay in this browser. Nothing is sent anywhere. |
| Upon submission of an incorrect response, a contextual hint is displayed. | After a wrong answer, a hint shows what to try. |

## 4. Check it

```sh
python3 tools/review.py                                # "docs" rows: missed docs, one language only, long sentences, hard words
python3 tools/guide_check.py                           # every game has a guide page, EN and DE
npm run build --prefix guide-src && node guide-src/scripts/check.mjs   # when guide-src/ changed: links, search, accessibility
```

The `docs` rows in `tools/review.py` are warnings. They do not fail CI. Fix them, or say in the pull request why a doc did not need to change.

Read every new sentence once more as a busy parent on a phone. Cut what does not help them.

## 5. Say it in the pull request

In the "Changes" list, add one line that says which docs changed. For example: "Guide (EN + DE), FAQ and Help page: Spelling Quiz word lists". Or "Docs: nothing people see changed".
