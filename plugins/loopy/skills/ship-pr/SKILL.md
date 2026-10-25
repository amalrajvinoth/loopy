---
name: ship-pr
description: Finish a loopy change and open its pull request with every check, screenshots and the template. Use at the end of any loopy change, or for "push", "open the PR", "ship it".
---

# Ship a loopy pull request

1. **Merge the latest main** into the branch first (`git fetch origin main && git merge origin/main`). The after_merge hook rebuilds generated files.
2. **Build:** `python3 tools/build.py`.
3. **Checks** (all must pass; the Stop hook runs the fast ones again before you finish):
   ```sh
   python3 tools/build.py --check
   python3 tools/csp.py --check
   python3 tools/check_external.py
   python3 tools/guide_check.py              # every game has a guide page, EN and DE
   python3 tools/review.py
   python3 plugins/sync.py --check            # plugin copies in .claude/
   python3 plugins/loopy/scripts/drift.py     # plugin in step with the repo
   python3 plugins/test_hooks.py              # only when plugins/ changed
   node tools/a11y/check.mjs
   node tools/e2e/play.mjs        # GAME=<id> for one game while you work; the full run before the PR
   node tools/e2e/retry.mjs       # Try again in every game (GAME=<id> for one): a mistake comes back until it is fixed
   node tools/e2e/levels.mjs      # levels follow the child: up by itself when ready, kept over the birthday
   node tools/e2e/offline.mjs     # after an update the offline copy saves the new pages, never an old one (when src/sw.js changed)
   node sync/test.mjs             # the Family sync server answers right (when sync/ changed)
   node tools/e2e/sync.mjs        # Family sync keeps two devices in step and sends nothing when off (when src/loopy-sync.js, sync/ or the home page changed)
   ```
   CI runs the a11y check and the play test in two halves at once (`SHARD=1/2`, `SHARD=2/2`). On a pull request it skips them, and the guide job, when `tools/ci_changes.py` says no file they read changed (docs, `.claude/`, `plugins/`). A new file type or folder the pages read must not match its DOCS list. "All checks" fails if any job failed.
   When `guide-src/` changed (or a game looks different), build and check the guide too (the CI "guide" job does the same):
   ```sh
   npm ci --prefix guide-src && npm run build --prefix guide-src   # also writes the guide pages' security policy
   npm run screens --prefix guide-src                             # only when a game looks different
   node guide-src/scripts/check.mjs                               # links, errors, search, accessibility
   ```
4. **Docs** with the loopy-docs skill: the guide (EN + DE), FAQ.md, the Help page, the game README, the main README and RELEASES.md, in plain English, in this same PR. Fix the `docs` rows from `tools/review.py`, or say why not.
5. **Review** with the loopy-review skill (or the `reviewer` agent). Fix every "must". Note speed and size findings for the PR.
6. **Screenshots** when anything on screen changed: `node plugins/loopy/scripts/screens.mjs --out <scratch>/after` on the branch, and with `--root <worktree of origin/main> --out <scratch>/before` for main. It fails if a page scrolls; fix that first. Copy the phone-size pair you show into `docs/screenshots/`, commit, and link them by raw.githubusercontent.com URL pinned to the commit.
7. **Commit** in plain words. No Claude attribution lines (a hook blocks them).
8. **Pull request** against `main` with `.github/pull_request_template.md`: What changed (a parent could read it), Changes (one line each, what someone will notice), Before and after (or delete it), Checked, a line on the docs that changed (or "Docs: nothing people see changed"), a line on speed and size ("nothing found" is fine), "Closes #N". Keep the project's "Requested by" lines at the top when the project asks for them. After creating it, open it again and remove any "Generated with/by Claude Code" line a tool added. Assign the owner and ask them for a review.
9. Watch it: fix red checks and conflicts yourself (the `heal` and `resolve-conflict` skills). At a terminal, a bare `/loop` does this on its own (`.claude/loop.md`).
10. Reply with the link and anything only a person can check (a real phone, iPhone Safari, print).
