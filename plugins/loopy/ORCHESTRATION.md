# How Claude runs a task

The main session is the orchestrator. It reads the task, picks a level, chooses the helpers it needs, checks their work and reports. Helpers are the subagents in `.claude/agents/`. They have no Agent tool, so they never start helpers of their own.

The stack: plain HTML, CSS and JavaScript pages built by `tools/build.py`, the guide in `guide-src/` (Astro and Starlight), the family sync Worker with Cloudflare D1 in `sync/`. GitHub Pages serves the site. Add no framework, dependency or config file without the owner's yes.

## 1. Pick the level

Pick the lowest level that fits; when torn between two, take the higher. Risk sets the level, not size: one line in `sync/` is Critical.

| Level | For | Plan | Helpers | Checks |
| --- | --- | --- | --- | --- |
| Low | A typo, a word, a doc line, a small fix in one file | None | None. Do it yourself | `tools/check.py`, read your own diff |
| Medium | A bug fix, a change to one game, a skill edit | Five lines, yourself | The `development-loop` skill without `architect` | Its test and review |
| High | A new game, a shared change in `src/`, several pages, a new check | `architect` | The whole `development-loop`; `researcher` or `Explore` first when something is unknown | Its test and review, `--webkit` when the layout changed |
| Critical | Saved data, `sync/` and the live tables, the service worker cache, security, secrets, anything that deploys or deletes | `architect` with a risk list | As High, with `effort: "xhigh"` for `architect` and `code-reviewer` | As High, and the owner's yes before each step in "What stays with the owner" (`development-loop`) |

A Low or Medium task that turns out bigger moves up a level; say so in the report.

## 2. Helpers

| Role | Helper | Use it |
| --- | --- | --- |
| Architect | `architect` | High and Critical. `planner` instead when the owner asked for options |
| Developer | `developer` | Medium and up, when the change is more than a few lines |
| Tester | `qa-engineer` | Medium and up. `screens` for before and after pictures |
| Reviewer | `code-reviewer` | Medium and up |
| Researcher | `researcher` | A browser feature, API or library the task depends on. The built-in `Explore` for a wide search of the repo |

- Each helper's model and effort are set in its own file. Never pass a model to a helper. Pass `effort` only where the table above says so.
- The session's own effort is the owner's (`/effort` or `claude --effort`). Never claim to have changed it.
- Give a helper the branch, the issue, its goal, the files it owns and what to return. It returns a short result, not a log.
- One helper owns a file at a time. Run helpers side by side only when they touch different things: `researcher` with `Explore`, `qa-engineer` with `screens`. Never two `developer` helpers on one branch.

## 3. The loop

1. Goal and "Done when" in a line each.
2. Level and helpers, in one line.
3. Plan (Medium and up), then build.
4. Test with `python3 tools/check.py`. A check passed only if it ran in this session; quote its result.
5. Review, fix, test again: at most three tries (`development-loop`).
6. Ship with `ship-pr`: a pull request with green checks is done.
7. Report: what changed, what ran and how it ended, what is left and the risks.

Keep going until done, or blocked by a step that is the owner's or an outside service. A plan is not the end when the owner asked for the build. "Plan for X" stops at the options (`plan-options`).
