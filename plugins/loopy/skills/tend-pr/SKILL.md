---
name: tend-pr
description: Tend the current branch's pull request until it is green and quiet. Use with the built-in loop (`/loop 15m /tend-pr`, or a bare `/loop`), for "tend the PR", "babysit the PR", or "keep the PR green".
---

# Tend the pull request

One round of care for the pull request of the branch you are on. Made for a loop: each round does the next small thing and says in one line whether anything is left. No new work, no new features.

## One round

1. **Catch up with main.** `git fetch origin main && git merge origin/main` (the after_merge hook rebuilds the built files). Then `python3 tools/build.py`. A conflict goes to the `resolve-conflict` skill.
2. **The fast checks** from the `ship-pr` skill step 3: `tools/build.py --check`, `tools/csp.py --check`, `tools/check_external.py`, `tools/guide_check.py`, `tools/review.py`, `plugins/sync.py --check`, `plugins/loopy/scripts/drift.py`, `node tools/lint/check.mjs`, `node tools/lint/scripts.mjs`. Fix what fails with the `heal` skill, never by loosening a check.
3. **Red CI.** Read the failing job's log on the latest commit and fix the cause (`heal`). One special case: when only the **picture test** is red, and the pull request is meant to look different (its body has a Before and after table, or says so), do not touch the saved pictures. Put the label `refresh pictures` on the pull request; the Refresh pictures workflow takes new pictures and commits them. Pull before you push again. When the look was not meant to change, the red is a real finding: fix the page.
4. **Review comments.** New CodeRabbit or human comments: fix what is right, answer what is not, and resolve the thread (the `apply-suggestions` skill). CodeRabbit may commit its own fixes; pull before you push.
5. **Push one validated fix at a time**, in plain words, no attribution lines.
6. **Report in one line.** "Green and quiet" when CI is green, no thread is open and main is merged: then stop the loop. Otherwise, what you did and what is still pending. When something needs the owner (a decision, a merge, a setting), say so and stop the loop too.

## Rules

- Never skip, disable or quarantine a test. Never force-push. Never merge.
- A flake is proven only by the same commit passing on a re-run; otherwise it is a bug.
- Two rounds with nothing to do means the loop is finished.
