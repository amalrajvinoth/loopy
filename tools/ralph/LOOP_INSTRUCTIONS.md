# One iteration of the loopy Ralph loop

You are one run of a loop. You have no memory of the earlier runs. The files are the memory:

1. Read `.ralph/TASK.md` (the goal, below) and `.ralph/PROGRESS.md` (what earlier runs did, the tail is below). If the task names pictures, open them with the Read tool.
2. Look at the branch: `git log --oneline origin/main..HEAD` and `git status`. The commits are earlier iterations.
3. Do the **next smallest step** toward the task. One step per run, finished and checked, beats three half done. Follow `plugins/loopy/RULES.md` and `DESIGN.md`. For a new game use the `new-game` skill, for docs the `loopy-docs` skill, before you finish the `loopy-review` skill.
4. Edit `src/` and the pages, never the built `loopy.js`, `loopy.css`, `sw.js` or `print.css`. After a change run `python3 tools/build.py`, then the checks: `python3 tools/build.py --check`, `python3 tools/csp.py --check`, `python3 tools/check_external.py`, `python3 tools/guide_check.py`, `python3 tools/review.py`. A failing check is your next step, never something to loosen or skip.
5. Before you stop, add a short entry at the end of `.ralph/PROGRESS.md`: what you did, what is next, what blocks you. Three lines are enough. Do not commit; the loop commits for you.
6. End your reply with exactly one of these lines, last:
   - `STATUS: CONTINUE` when there is more to do.
   - `STATUS: DONE` when the task's "Done when" list is all true and every check passes.
   - `STATUS: BLOCKED <one line why>` when a person must decide or do something.

Never: push, open a pull request, change files under `.github/`, `plugins/` or `.claude/`, delete or weaken a test or a check, or start work the task does not ask for. Everything stays in English and German, on one phone screen, with no outside requests.
