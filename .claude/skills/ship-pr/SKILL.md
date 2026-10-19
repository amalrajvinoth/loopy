---
name: ship-pr
description: Finish a loopy change and open its pull request with every check, screenshots and the template. Use at the end of any loopy change, or for "push", "open the PR", "ship it".
---

<!-- Copied from plugins/loopy/skills/ship-pr/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Ship a loopy pull request

1. **Merge the latest main** into the branch first (`git fetch origin main && git merge origin/main`). The after_merge hook rebuilds generated files.
2. **Build:** `python3 tools/build.py`.
3. **Checks** (all must pass; the Stop hook runs the fast ones again before you finish):
   ```sh
   python3 tools/build.py --check
   python3 tools/csp.py --check
   python3 tools/check_external.py
   python3 tools/review.py
   python3 plugins/sync.py --check            # plugin copies in .claude/
   python3 plugins/loopy/scripts/drift.py     # plugin in step with the repo
   python3 plugins/test_hooks.py              # only when plugins/ changed
   node tools/a11y/check.mjs
   node tools/e2e/play.mjs        # GAME=<id> for one game while you work; the full run before the PR
   node tools/e2e/retry.mjs       # Try again in every game (GAME=<id> for one): a mistake comes back until it is fixed
   ```
4. **Review** with the loopy-review skill (or the `reviewer` agent). Fix every "must". Note speed and size findings for the PR.
5. **Screenshots** when anything on screen changed: `node plugins/loopy/scripts/screens.mjs --out <scratch>/after` on the branch, and with `--root <worktree of origin/main> --out <scratch>/before` for main. It fails if a page scrolls; fix that first. Copy the phone-size pair you show into `docs/screenshots/`, commit, and link them by raw.githubusercontent.com URL pinned to the commit.
6. **Commit** in plain words. No Claude attribution lines (a hook blocks them).
7. **Pull request** against `main` with `.github/pull_request_template.md`: What changed (a parent could read it), Changes (one line each, what someone will notice), Before and after (or delete it), Checked, a line on speed and size ("nothing found" is fine), "Closes #N". Keep the project's "Requested by" lines at the top when the project asks for them. After creating it, open it again and remove any "Generated with/by Claude Code" line a tool added. Assign the owner and ask them for a review.
8. Watch it: fix red checks and conflicts yourself (the `heal` and `resolve-conflict` skills).
9. Reply with the link and anything only a person can check (a real phone, iPhone Safari, print).
