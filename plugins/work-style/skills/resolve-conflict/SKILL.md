---
name: resolve-conflict
description: Fix a merge conflict on a pull request. Use for "Resolve conflict", "Fix conflict on GitHub", "merge main", or a merge-conflict notice.
---

# Resolve a conflict

1. Fetch the main branch and the pull request branch. Check out the pull request branch.
2. Merge the main branch in: `git merge origin/main`. Never rebase or force-push a branch someone else may have checked out.
3. **Built files are rebuilt, not merged by hand.** In loopy, the `after_merge` hook does this for you right after the merge: it takes either side of `loopy.js`, `loopy.css`, `sw.js` and of any page where only the security policy line conflicts, then runs `python3 tools/build.py`. Read what it printed. In another repo, regenerate lockfiles and generated files with that repo's own tools.
4. Resolve what is left by hand. Keep both sides' behaviour. If both sides changed the same logic and keeping both is not possible, stop and ask in one line which wins.
5. Run every check the repo has (in loopy: the `heal` skill's fast checks, then the play test). Commit the merge and push.
6. Reply in one or two lines: what conflicted and that both sides were kept. Edit the reply when the checks on GitHub are green.
