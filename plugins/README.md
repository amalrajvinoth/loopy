# Claude Code plugins for loopy

Two plugins, made from how the owner works on loopy. They turn the asks the owner types again and again into commands, keep the rules with hooks, heal failing checks, and keep themselves up to date.

| Plugin | For | What is in it |
| --- | --- | --- |
| `work-style` | Any repo | How the owner works: plans with numbered options, "go", fix an issue, plan a pull request fix, resolve a conflict, apply all suggestions, add a rule. Blocks Claude attribution. |
| `loopy` | This repo | Next roadmap task, build an issue, new game, keep the docs up to date, ship a pull request with every check, mark as done, update the roadmap, heal, evolve, the weekly check. Guards built files and pages, rebuilds after a merge, checks before finishing. |

## What you type and what runs

| You type | Skill | Plugin |
| --- | --- | --- |
| "Plan for X", "Brain-storm X" | `plan-options` | work-style |
| a number, "go", "use recommended", "approve and implement" | `go` | work-style |
| "fix: &lt;issue link&gt;" | `fix-issue` | work-style |
| "Plan to fix: &lt;PR link&gt;" | `plan-pr-fix` | work-style |
| "Resolve conflict", "Fix conflict on GitHub" | `resolve-conflict` | work-style |
| "apply all suggestion" | `apply-suggestions` | work-style |
| "from now on...", "Update memory and instructions..." | `add-rule` | work-style |
| "Take next task", "take next 3 tasks", "Start next" | `next-task` | loopy |
| "Build #N" | `build-issue` | loopy |
| "add a game" | `new-game` | loopy |
| "push", "ship it" | `ship-pr` | loopy |
| "update the docs", "update the guide", "update the FAQ" (and every change people can see) | `loopy-docs` | loopy |
| "Mark as done" | `mark-done` | loopy |
| "Update roadmap ticket" | `update-roadmap` | loopy |
| "fix CI", "it's broken" | `heal` | loopy |
| "evolve the plugin" | `evolve` | loopy |
| "weekly check", "what needs me" (and every Monday by itself, from the project's scheduled task) | `weekly-check` | loopy |

You can keep typing the way you do now. Claude picks the skill from what you write. You can also call one by name: `/next-task` in this repo, or `/loopy:next-task` where the plugin is installed.

## Hooks (they run by themselves)

| When | Hook | What it does |
| --- | --- | --- |
| A session starts | `rules.py`, `session_start.py` | Shows the rules (`RULES.md` of each plugin), installs the minifiers and the test packages if missing, reports drift |
| You send a message | `catch_rule.py` | Notices a new standing rule ("from now on", "always", "never") so Claude records it |
| Before a commit, PR or comment | `no_attribution.py` | Blocks "Co-Authored-By: Claude", "Claude-Session", "Generated with Claude Code" and session links |
| Before an edit | `guard_files.py` | Blocks edits to the built `loopy.js`, `loopy.css`, `sw.js`, and `style=` or `on...=` in pages |
| After `git merge` or `git pull` | `after_merge.py` | Resolves conflicts that are only in built files or the security policy line, rebuilds, stages them |
| Before Claude finishes | `heal.py` | Rebuilds stale files by itself; sends Claude back if a check fails |

## Self-healing

1. **Fixes itself:** stale built files and page policies, conflicts in generated files, stale `.claude/` copies. No one has to ask.
2. **Sends Claude back:** an outside request, a `must` from `tools/review.py`, a failing hook test, or the plugin behind the repo. Claude cannot finish until they pass.
3. **Learns:** the `heal` skill keeps `skills/heal/recipes.md`. A new failure gets a recipe. The same failure twice becomes a hook or a check.

## Self-evolving

1. **The repo moves:** `scripts/drift.py` knows the facts the plugin depends on (CI steps, tools, built files, PR template, screen sizes, GAMES lists) in `facts.json`. When a change moves one, CI fails and names the skill or hook to update. The `evolve` skill updates it and runs `drift.py --update`.
2. **You ask for something new:** `catch_rule.py` notices new rules, and `add-rule` writes them into `RULES.md` (and a hook when a machine can check it). `evolve` also looks for asks you typed three or more times with no skill and adds one.
3. **Work goes wrong twice:** a heal recipe used twice becomes a hook or check.
4. Every change to the plugins bumps its version and adds a line to `CHANGELOG.md`.

Evolve never loosens a rule, check or hook by itself. That needs your word.

## Where it runs

- **Cloud threads and anyone working in this repo:** nothing to install. Claude Code on the web does not install plugins from a repo's settings, so `python3 plugins/sync.py` copies the skills and agents into `.claude/skills` and `.claude/agents`, and the hooks into `.claude/settings.json`. These load in every session in this repo.
- **Your own computer, or another repo:** in Claude Code run
  ```
  /plugin marketplace add amalrajvinoth/loopy
  /plugin install work-style@loopy-plugins
  /plugin install loopy@loopy-plugins
  ```
  Only `work-style` makes sense outside loopy. Inside the loopy repo you don't need to install anything; if you do, the loopy hooks step aside for the repo's own copy.

## Changing the plugins

Edit `plugins/`, never the copies in `.claude/` (like `src/` and the built `loopy.js`). Then:

```sh
python3 plugins/sync.py                    # refresh .claude/
python3 plugins/test_hooks.py              # hook tests
python3 plugins/loopy/scripts/drift.py     # in step with the repo
claude plugin validate plugins/loopy       # when the Claude Code CLI is there
```

CI runs the first three on every push and pull request.
