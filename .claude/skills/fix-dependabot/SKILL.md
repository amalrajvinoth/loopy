---
name: fix-dependabot
description: Fix every red Dependabot pull request on loopy on its own branch and merge it when green. Use with /loop (`/loop 1h /fix-dependabot`), for "fix dependabot" or "the bumps are red".
---

<!-- Copied from plugins/loopy/skills/fix-dependabot/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Fix red Dependabot pull requests

Green patch and minor Dependabot pull requests merge by themselves (`.github/workflows/dependabot-merge.yml`; Dependabot proposes a release 7 days after it came out). A major version bump (1.x to 2.x) and a red one wait for a person. A green major is the owner's call: say what changed and do not merge it. This skill takes the red ones.

## One round

1. **List them.** `gh api 'repos/amalrajvinoth/loopy/pulls?state=open&per_page=100&page=N'`, page by page until a page comes back empty, keep the ones whose `user.login` is `dependabot[bot]`. For each, the check runs on its head commit. A green one the workflow leaves open on purpose goes to step 5: a patch or minor bump a person pushed to, a major bump, or one whose title and body do not spell out both versions of every bump in it (the workflow reads "from X to Y" in both), or one that the workflow tried to merge and could not (a conflict with `main`: merge `main` into its branch first, like any red one, then it is a person-pushed bump). Once step 5 has named such a pull request for the owner, it is waiting for the owner and does not keep the loop running, as long as nothing about it changes: head commit, check result, title or body. When any of them changes, look at it afresh. None red (a red one step 5 has named for the owner counts as waiting for the owner, not as red), none waiting for step 5, and none still running or missing: say "no red Dependabot pull request" (and name what waits for the owner) and stop the loop. A check still running or missing is waiting: say "waiting for checks" and keep the loop going, so the next round looks again. So is a green patch or minor bump only Dependabot pushed to, until the merge workflow has had its go at that head commit (it merges, or leaves the pull request open with a red run that says why).
2. **Read the failing job's log** before touching anything. Match it to a `heal` recipe; `plugins/loopy/skills/heal/recipes.md` has the TypeScript and Stylelint ones.
3. **Fix on the Dependabot branch.** `git fetch origin <branch> && git checkout <branch> && git merge --ff-only origin/<branch>` (Dependabot may have pushed since the last time; a branch that will not fast-forward has work of yours on it, so stop and look before you touch it), the smallest change that makes the new version work, `python3 tools/build.py` when `tools/build/` changed (the built files must not change: esbuild strips comments, so a type hint is free). Commit in plain words as the owner, push to the same branch. Never bump a version by hand to dodge the failure, and never pin back.
4. **A patch or minor bump the repo cannot take yet** (a peer range, a dropped Node version, a plugin that is not ready): close the pull request with one plain comment saying why and what has to happen first, so Dependabot offers the next release again. No footer lines. Before closing, read every version pair in the title and the body (a grouped pull request lists them in the body). A major bump, or a pull request with a version pair neither spells out, is never closed here, red or green: say what blocks it and leave the whole pull request open for step 5, so the owner decides on the open pull request.
5. **Merge when green.** Once a person pushed, the workflow no longer merges (the run's actor is not Dependabot). A major bump, or a pull request whose versions the workflow could not read, stays open whatever its colour: name it for the owner and never merge it. For a patch or minor bump, when the owner started this skill, at a terminal or with "go", merge it yourself: `gh api -X PUT repos/amalrajvinoth/loopy/pulls/N/merge -f merge_method=merge -f sha=<the head commit the checks were read on>`, so GitHub refuses the merge if Dependabot pushed again in between. From the weekly check, stop before the merge and name it as the owner's next step.
6. **Report in one line** per pull request: fixed and merged, fixed and waiting for the merge, or closed and why.

## Rules

- Never skip or loosen a check to get a bump green; a bump that needs that is "not ready" (step 4).
- One pull request at a time: two pushes a minute apart make the CodeQL uploads collide and go red for no reason.
- `GET .../dependabot/alerts` answers 403 outside the owner's own session; the pull requests are the list.
