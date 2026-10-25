# The Ralph loop

A small script that runs Claude Code on your Mac again and again, with a fresh memory each time, until a task is done. Files and git history are the memory. It is the "Ralph loop" from the Claude Code community, made safe for loopy.

Everything in it stays free: it uses your Claude subscription and your Mac. Nothing runs on a server.

## Run it

```sh
tools/ralph/ralph.sh "Make the Pizza Fractions hint shorter on small phones"
tools/ralph/ralph.sh --issue 147          # the task is a GitHub issue, with its pictures
tools/ralph/ralph.sh --task my-task.md    # the task is a file you wrote (see TASK.example.md)
```

Options:

- `--name <slug>`: the branch and folder name.
- `--max 8`: how many iterations at most.
- `--sleep 30`: seconds between runs.
- `--budget 5`: dollars, as Claude counts them.
- `--model <name>` and `--max-turns 40`: per run.
- `--resume`: carry on a loop you stopped.

## What happens

1. It makes a git worktree next to this repo, `../loopy-ralph-<name>`, on the branch `ralph/<name>`, from the latest `main`. Never on `main`, never in your working copy.
2. It writes the task to `.ralph/TASK.md` in that folder. With `--issue`, that is the issue's text, plus its pictures saved in `.ralph/issue/` so Claude can look at them.
3. Each iteration runs `claude -p` with `LOOP_INSTRUCTIONS.md`, the task and the tail of `.ralph/PROGRESS.md`. Claude does the next smallest step, adds a line to PROGRESS.md and ends with `STATUS: CONTINUE`, `DONE` or `BLOCKED`.
4. After every iteration the script itself runs the checks (`build.py --check`, `csp.py --check`, `check_external.py`, `guide_check.py`, `review.py`, the plugin checks). Claude saying DONE counts only when they pass. The result goes into PROGRESS.md, and the changes are committed as "ralph <name>, iteration N".
5. It stops on DONE with green checks, on BLOCKED, at the iteration cap, at the budget, when you `touch .ralph/STOP` in the worktree, or on Ctrl-C.
6. It never pushes. You read the branch and ship it yourself:

```sh
cd ../loopy-ralph-<name> && git log --oneline origin/main..HEAD && cat .ralph/PROGRESS.md
git push -u origin ralph/<name>     # then open the pull request, or say "push" in Claude there
cd - && git worktree remove ../loopy-ralph-<name>
```

## What keeps it safe

- Fresh branch and folder every time; `main` and your working copy are never touched.
- No `--dangerously-skip-permissions`. Claude may edit files and run the loopy tools, `git status`, `git diff` and `git log`. It cannot push, run other commands, or change `.github/`, `plugins/` or `.claude/`.
- The repo's hooks still run: no edits to built files, no `style=` or `on...=` in pages, a rebuild before each run ends.
- Caps on iterations, turns per run and cost. Logs for every run in `.ralph/outputs/`.
- Verification is a script, not Claude's word.

Start with small, clear tasks that have a "Done when" list. A task with no stop condition runs until the cap. For anything that should run without you, the weekly check, the live site check and the pull request checks are the better loop. This one is for a task you want done while you are away from the keyboard for an hour.

## Files

| File | What it is |
| --- | --- |
| `ralph.sh` | The loop |
| `LOOP_INSTRUCTIONS.md` | What every iteration is told |
| `TASK.example.md` | A task file to copy |
| `issue.py` | Turns a GitHub issue and its pictures into a task file |
| `status.py` | Reads Claude's STATUS line and cost from a run |
| `.ralph/` (in the worktree, not in git) | `TASK.md`, `PROGRESS.md`, `issue/`, `outputs/` |
