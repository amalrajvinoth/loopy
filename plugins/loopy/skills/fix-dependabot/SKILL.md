---
name: fix-dependabot
description: Fix every red Dependabot pull request on loopy on its own branch and merge it when green. Use with the built-in loop (`/loop 1h /fix-dependabot`), for "fix dependabot", "the bumps are red", or from the weekly check.
---

# Fix red Dependabot pull requests

Green Dependabot pull requests merge by themselves (`.github/workflows/dependabot-merge.yml`). The red ones waited for a person: TypeScript 7 wanted a new `module` option and two type hints, Stylelint 18 was blocked by a plugin's peer range. This skill takes them.

## One round

1. **List them.** `gh api 'repos/amalrajvinoth/loopy/pulls?state=open&per_page=50'`, keep the ones whose `user.login` is `dependabot[bot]`. For each, the check runs on its head commit. None red: say "no red Dependabot pull request" and stop the loop.
2. **Read the failing job's log** before touching anything. Match it to a `heal` recipe; `plugins/loopy/skills/heal/recipes.md` has the TypeScript and Stylelint ones.
3. **Fix on the Dependabot branch.** `git fetch origin <branch> && git checkout <branch>`, the smallest change that makes the new version work, `python3 tools/build.py` when `tools/build/` changed (the built files must not change: esbuild strips comments, so a type hint is free). Commit in plain words as the owner, push to the same branch. Never bump a version by hand to dodge the failure, and never pin back.
4. **A bump the repo cannot take yet** (a peer range, a dropped Node version, a plugin that is not ready): close the pull request with one plain comment saying why and what has to happen first, so Dependabot offers the next release again. No footer lines.
5. **Merge when green.** Once a person pushed, the workflow no longer merges (the run's actor is not Dependabot). When the owner started this skill, at a terminal or with "go", merge it yourself: `gh api -X PUT repos/amalrajvinoth/loopy/pulls/N/merge -f merge_method=merge`. From the weekly check, stop before the merge and name it as the owner's next step.
6. **Report in one line** per pull request: fixed and merged, fixed and waiting for the merge, or closed and why.

## Rules

- Never skip or loosen a check to get a bump green; a bump that needs that is "not ready" (step 4).
- One pull request at a time: two pushes a minute apart make the CodeQL uploads collide and go red for no reason.
- `GET .../dependabot/alerts` answers 403 outside the owner's own session; the pull requests are the list.
