# Claude Code plugins for loopy

Two plugins, made from how the owner works on loopy. They turn the asks the owner types again and again into commands, keep the rules with hooks, heal failing checks, and keep themselves up to date.

| Plugin | For | What is in it |
| --- | --- | --- |
| `work-style` | Any repo | How the owner works: plans with numbered options, "go", fix an issue, plan a pull request fix, resolve a conflict, apply all suggestions, add a rule. Blocks Claude attribution. |
| `loopy` | This repo | Next roadmap task, build an issue, new game, keep the docs up to date, improve the UI of one page (an audit against `DESIGN.md` and a plan, from [ui-skills](https://github.com/ibelick/ui-skills)), ship a pull request with every check, mark as done, update the roadmap, heal, evolve, the weekly check. Guards built files and pages, rebuilds after a merge, checks before finishing. |

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
| "Build #N", "Build N" | `build-issue` | loopy |
| "use the loop" (and the build step of `build-issue`, `fix-issue` and `go`) | `development-loop` | loopy |
| "add a game" | `new-game` | loopy |
| "push", "ship it" | `ship-pr` | loopy |
| "update the docs", "update the guide", "update the FAQ" (and every change people can see) | `loopy-docs` | loopy |
| "improve the UI of X", "review the look of X", "/improve-ui" | `improve-ui` | loopy |
| "Mark as done" | `mark-done` | loopy |
| "Update roadmap ticket" | `update-roadmap` | loopy |
| "fix CI", "it's broken" | `heal` | loopy |
| "evolve the plugin" | `evolve` | loopy |
| "weekly check", "what needs me" (and every Monday by itself, from the project's scheduled task) | `weekly-check` | loopy |
| "tend the PR", "keep the PR green", `/loop 15m /tend-pr` or a bare `/loop` | `tend-pr` | loopy |
| "close out", "fill the PR numbers", `/loop 30m /close-out` | `close-out` | loopy |
| "fix dependabot", "the bumps are red", `/loop 1h /fix-dependabot` | `fix-dependabot` | loopy |
| "phone checks", "what should I check on the phone", `/loop 1h /phone-checks` | `phone-checks` | loopy |

You can keep typing the way you do now. Claude picks the skill from what you write. You can also call one by name: `/next-task` in this repo, or `/loopy:next-task` where the plugin is installed.

## Hooks (they run by themselves)

| When | Hook | What it does |
| --- | --- | --- |
| A session starts | `rules.py`, `session_start.py` | Installs the minifiers and the test packages if missing, reports drift. The rules themselves come from `AGENTS.md`, which `sync.py` writes from both `RULES.md` files and `CLAUDE.md` loads; `rules.py` prints the work-style rules only in a repo whose `AGENTS.md` does not hold them |
| You send a message | `catch_rule.py` | Notices a new standing rule ("from now on", "always", "never") so Claude records it |
| Before a commit, PR or comment | `no_attribution.py` | Blocks "Co-Authored-By: Claude", "Claude-Session", "Generated with Claude Code" and session links |
| Before a shell command or a GitHub tool | `approval_guard.py` | Stops the owner's steps: a deploy, a `wrangler` command with `--remote`, a secret, a push to `main` or a force push, a merge, a repo setting. Local work, work branches and draft pull requests stay free. The owner lets one session through by starting Claude Code with `LOOPY_OWNER_APPROVED=1` |
| Before an edit | `guard_files.py` | Blocks edits to the built `loopy.js`, `loopy.css`, `sw.js`, and `style=` or `on...=` in pages |
| After `git merge` or `git pull` | `after_merge.py` | Resolves conflicts that are only in built files or the security policy line, rebuilds, stages them |
| Before Claude finishes | `heal.py` | Rebuilds stale files by itself; sends Claude back if a check fails |

## The development loop and its helpers

The `development-loop` skill builds one change in four steps, each done by a helper (a subagent in `.claude/agents/`). A **try** is one build with its test and review. After three tries that are not clean, it stops and asks the owner with the error, what each try changed and two or three ways forward.

| Step | Helper | What it does |
| --- | --- | --- |
| Plan | `architect` | The build plan for the picked task: files, risks, checks, a "Done when" list. Read-only |
| Build | `developer` | One focused change, `tools/build.py`, `tools/check.py --fast`, a commit. Never pushes |
| Test | `qa-engineer` | `tools/check.py`, screenshots at the eight sizes, GREEN or RED with the exact error and its heal recipe. Read-only |
| Review | `code-reviewer` | The loopy-review report: Must fix, Should fix, Suggestion. Read-only |

`planner` (options for "Plan for X") and `screens` (before and after pictures) are helpers too. A clean loop hands over to `ship-pr` at its screenshots step. `.claude/settings.json` also denies the plainest forms of a merge, a deploy and a secret, as a second lock behind `approval_guard.py`.

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

## Short on purpose

Every session reads `AGENTS.md` and every skill's description. A skill's body is read whole each time it is used. So the text is kept short, and each fact lives in one place:

- **The checks** are one script, `tools/check.py`. It runs what a change needs and says why a red check matters. The skills, `AGENTS.md` and the README point at it; none of them lists the checks again. `drift.py` fails when CI gains a check the script does not have.
- **The rules** are `RULES.md` (one or two lines each) and, for the look, `DESIGN.md` "7. Do and don't". The review and improve-ui skills say how to check them, and do not repeat them.
- **Detail that is needed only sometimes** sits in a page next to its skill, read when the skill says so: `loopy-review` has `screen.md`, `saved-data.md`, `speed.md` and `release-notes.md`; `loopy-docs` has `docs-map.md`; `improve-ui` has `references/`.
- **heal reads one recipe**, found by the error text or by the title `tools/check.py` prints, never all of `recipes.md`.
- **`sync.py --check` holds the line:** a `SKILL.md` up to 6 KB, a description up to 200 characters and without ` #` or `: ` (the frontmatter cuts it off there), `AGENTS.md` up to 10 KB. Past that, shorten or move detail to a page. The `LONGER` list in `sync.py` is only for a skill copied word for word from somewhere else (improve-ui).

No skill sets `disable-model-invocation`. It would take a description out of every session, but `/loop 15m /tend-pr` could then no longer start the skill.

## Where it runs

- **Cloud threads and anyone working in this repo:** nothing to install. Claude Code on the web does not install plugins from a repo's settings, so `python3 plugins/sync.py` copies the skills and agents into `.claude/skills` and `.claude/agents`, and the hooks into `.claude/settings.json`. These load in every session in this repo.
- **A task while you are away from the keyboard:** `tools/ralph/ralph.sh "<task>"` runs Claude Code on it again and again on its own branch, with these skills and hooks, until it is done ([how](../tools/ralph/README.md)).
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
python3 plugins/sync.py                    # refresh .claude/ and AGENTS.md, and check the sizes
python3 plugins/test_hooks.py              # hook tests
python3 plugins/loopy/scripts/drift.py     # in step with the repo
claude plugin validate plugins/loopy       # when the Claude Code CLI is there
```

CI runs the first three on every push and pull request.
