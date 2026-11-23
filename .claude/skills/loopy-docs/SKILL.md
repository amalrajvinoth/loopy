---
name: loopy-docs
description: Keep loopy's docs up to date in the same pull request, in plain English. Use on every change people can see or use, and for "update the docs", "update the guide", "update the FAQ".
---

<!-- Copied from plugins/loopy/skills/loopy-docs/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Keep the docs up to date

Every change that alters what a child or grown-up sees or does also updates the docs that describe it, in the same pull request. A doc that says something the site no longer does is a bug.

## 1. Find what changed

```sh
git diff --stat origin/main...HEAD
python3 tools/review.py        # the "docs" rows say which docs this change may have missed
```

Ask one question: **will a child or a grown-up notice it?** A new button, new words on screen, a new setting, a game that plays differently, a new level, a print that looks different, a fix for something people saw. If yes, the docs change too. If nobody will notice (a refactor, CI, tests, tooling), write "Docs: nothing people see changed" in the pull request and stop here.

## 2. Find the docs it touches

Read `docs-map.md` next to this file: it maps each kind of change to its README, guide pages (always English and German) and other docs.

**The FAQ lives in three places.** A changed answer changes in all three, in both languages:

1. `FAQ.md`
2. The Help page, `help/index.html`: strings `q1`/`a1`, `q2`/`a2`... in `en` and `de`. The loop under the strings stops at the last number; raise it when you add a question.
3. The guide, `help/faq.md` (EN + DE).

**Release notes.** For a change people will notice, add one row at the top of the table in RELEASES.md: date (YYYY-MM-DD), what is new, where, PR number. Add the same news, shorter, at the top of the guide's `help/whats-new.md` in English and German, under a heading with the date: "21 October 2026", in German "21. Oktober 2026". `release-notes.md` in the loopy-review skill says what counts.

## 3. Write it in plain English

Parents, teachers and kids read the docs, many on a phone, many in their second language.

- **Lead with what people can do.** "Pick the right spelling out of 3." Not "This game presents a multiple-choice spelling task."
- **Short sentences.** One idea each. Aim for 15 words, never more than 25. Active voice: "Tap **Check**."
- **Everyday words.** "use" not "utilise", "start" not "initiate", "about" not "approximately", "for example" not "e.g.".
- **No code words** in the guide, FAQ, Help page or RELEASES.md: no "localStorage", "service worker", "toggle", "modal", "cache". Say "saved in this browser", "works offline", "button", "box".
- **Name buttons the way the screen does**, in **bold**: **Check**, **Next**, ⚙ **Settings**. German pages use the German words from the game's `de` strings.
- **Say "you" and "your child".** German pages say "du", like the games.
- **Lowercase "loopy"** on the site, the Help page and the guide. Repo docs may say "Loopy" at the start of a sentence.
- **Numbers as digits.** "3 tries", "ages 6 to 12".
- **Only write what the site really does.** Check the code or play the game when unsure.
- **Short release rows.** One or two sentences: what is new and what a child can do now.

The **For kids** box on a guide game page has 3 steps of up to 10 easy words. A 7-year-old should be able to read it alone. **German** is real German, not word-for-word English: same facts, same buttons, same order of sections.

| Hard to read | Plain |
| --- | --- |
| Progress is persisted locally via browser storage and is not transmitted. | Stars stay in this browser. Nothing is sent anywhere. |
| Upon submission of an incorrect response, a contextual hint is displayed. | After a wrong answer, a hint shows what to try. |

## 4. Check it

`python3 tools/check.py` runs what the docs need: `tools/review.py` (its `docs` rows: missed docs, one language only, long sentences, hard words), the guide pages check, the links, and the guide build when `guide-src/` changed. The `docs` rows are warnings: fix them, or say in the pull request why a doc did not need to change.

Read every new sentence once more as a busy parent on a phone. Cut what does not help them.

## 5. Say it in the pull request

One line in the "Changes" list says which docs changed: "Guide (EN + DE), FAQ and Help page: Spelling Quiz word lists". Or "Docs: nothing people see changed".
