---
name: development-loop
description: Build one loopy change with the plan, build, test, review loop and its helpers, at most three tries. Use for the build step of build-issue, fix-issue and go, or for "use the loop".
---

<!-- Copied from plugins/loopy/skills/development-loop/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# The development loop

One change, four helpers, at most three tries. A **try** is one `developer` pass with its test and review.

1. **Plan.** Ask the `architect` helper for the build plan. For a fix of a line or two, plan it yourself in five lines. If the plan names a step only the owner may do, say so now and leave it out of the build.
2. **Build.** Give the plan, the branch and the issue number to the `developer` helper.
3. **Test.** Ask the `qa-engineer` helper. RED: back to step 2 with its exact output. That ends this try.
4. **Review.** GREEN: ask the `code-reviewer` helper. A Must fix goes back to step 2 and ends this try. Fix a Should fix in the same try, or note why not for the pull request.
5. **Stop at three.** When the third try is still RED or has a Must fix, stop. Do not start a fourth try, widen the task, or loosen a check. Tell the owner, in plain words:
   - what fails, with the exact error text;
   - what each try changed;
   - two or three ways forward, one marked ⭐.
   Push the branch and open a draft pull request so the work is not lost, then wait.
6. **Clean:** go on with the `ship-pr` skill. The loop already ran its checks, review and improve-ui on this commit, so start at its step 7 (screenshots). Run the checks again only if main was merged in since. Write "Loop: N of 3 tries" in the pull request's Checked list.

Helpers start with no memory of this session. Give each one the branch, the issue, the plan, and the last findings.

## What stays with the owner

Never without the owner's own yes in this task: a merge (main is live, and a merged `sync/` change deploys the Worker and runs its table files on the live databases), `wrangler deploy`, any `wrangler` command with `--remote`, a secret, a repo setting, a message outside the project. The `approval_guard` hook stops these. When one is needed, ask once with: the target, the exact command, what it will do, and how to undo it.

Opening a draft pull request is not one of these: a pull request with green checks is how the owner's work is done.
