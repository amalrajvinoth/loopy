---
name: ship-pr
description: Finish a loopy change and open its pull request with every check, screenshots and the template. Use at the end of any loopy change, or for "push", "open the PR", "ship it".
---

<!-- Copied from plugins/loopy/skills/ship-pr/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Ship a loopy pull request

After a clean `development-loop`, skip steps 3 and 6 only while nothing changed since its last try (no edit, and step 1 merged nothing new). If a later step changes a file, run this skill's step 3 again before the pull request; a code fix from the UI audit goes back to the test step of `development-loop` instead.

1. **Merge the latest main** into the branch (`git fetch origin main && git merge origin/main`). The after_merge hook rebuilds generated files.
2. **Build:** `python3 tools/build.py`.
3. **Checks:** `python3 tools/check.py`. It runs what the change needs, and for a red one prints why it matters and the heal recipe that fits. Fix the cause, then run the red ones again by name. Add `--webkit` when the change touches layout or anything Safari does differently. A check it lists as "not run here" runs in CI: say so in the pull request. When a game looks different, also run `npm run screens --prefix guide-src` and commit `guide-src/src/assets/screens/`, so the guide shows no old layout.
4. **Docs** with the loopy-docs skill, in this same pull request. Fix the `docs` rows from `tools/review.py`, or say why not.
5. **UI audit** when anything on a page looks different: `/improve-ui <page>` (the repo's own copy). Fix its findings in this pull request, or say there why not.
6. **Review** with the loopy-review skill (or the `code-reviewer` agent). Fix every "Must fix". Note speed and size findings for the pull request.
7. **Screenshots** when anything on screen changed: `node plugins/loopy/scripts/screens.mjs --out <scratch>/after` on the branch, and with `--root <worktree of origin/main> --out <scratch>/before` for main. It fails if a page scrolls; fix that first. Then look at the pictures: nothing cut off (the tablet held upright and a phone on its side go first), no mostly empty card on a tablet or a monitor, no greyed-out Next before an answer, no hint bubble over a key or a word. Take them again after a wrong answer with the longest explanation and with Settings open. Copy the phone-size pair you show into `docs/screenshots/`, commit, and link them by raw.githubusercontent.com URL pinned to the commit.
8. **Commit** in plain words. No Claude attribution lines (a hook blocks them).
9. **Pull request** against `main` with `.github/pull_request_template.md`: What changed (a parent could read it), Changes (one line each, what someone will notice), Before and after (or delete it), Check on a phone (what only a real phone or tablet shows, one line each; delete it when there is nothing: the `phone-checks` skill reads it), Checked, a line on the docs that changed (or "Docs: nothing people see changed"), a line on speed and size ("nothing found" is fine), "Closes #N". Keep the project's "Requested by" lines at the top when the project asks for them. After creating it, open it again and remove any "Generated with/by Claude Code" line a tool added. Assign the owner and ask them for a review.
10. **Watch it.** Fix red checks and conflicts yourself (the `heal` and `resolve-conflict` skills). CodeRabbit comments a few minutes after each push: read them before the pull request is marked ready, fix what is right and answer what is not (the `apply-suggestions` skill does both). When the owner ticks its "Autofix" box it commits its own fixes, so pull before you push. At a terminal, `/loop 15m /tend-pr` (or a bare `/loop`) does the watching, and `/loop 30m /close-out` fills the PR numbers and ticks the roadmap after the merge. A `ralph/<name>` branch came from `tools/ralph/ralph.sh`; its `.ralph/PROGRESS.md` says what each round did.
11. Reply with the link and anything only a person can check (a real phone, iPhone Safari, print).
