---
name: weekly-check
description: The Monday check of loopy: what merged, what is red, whether the plugins fell behind, and what waits on the owner. Runs by itself from the project's weekly scheduled task; also for "weekly check" or "what needs me".
---

<!-- Copied from plugins/loopy/skills/weekly-check/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Weekly check

A loop that says nothing when nothing needs a person. One message at most, one small pull request at most.

## 1. Read, do not guess

- Merged pull requests and commits on `main` since the last Monday, from GitHub.
- Open pull requests: CI state, conflicts with `main`, waiting on whom. Dependabot pull requests that are red (green ones merge by themselves, see `.github/workflows/dependabot-merge.yml`).
- The last runs of the workflows on `main`: Checks, Pages (its "Live site check" job), Lighthouse, Family sync server. A red one is news.
- Open roadmap issues in #21: the next one in order, and any issue with no pull request for more than two weeks.
- On a fresh clone of `main`: `python3 plugins/loopy/scripts/drift.py` and `python3 tools/review.py` (its `docs` rows). Nothing else runs; the browser tests ran on every merge.

## 2. Decide

| Found | Do |
| --- | --- |
| Nothing red, nothing waiting, plugins in step | Say nothing. The silence is the result. |
| A red workflow on `main`, a conflict, or a pull request waiting on the owner | One short message: what, where (link), and what the owner should do. Plain English, under 80 words. |
| `drift.py` says the plugins are behind | Run the `evolve` skill: one small pull request "Plugin: learn <what>". Mention it in the same message. |
| `review.py` names docs that lag | Add it to the message as one line. Do not open a docs pull request from here. |

Never start a roadmap task from this check; "Start next" stays the owner's word. Never merge anything. Never close an issue.

## 3. Message

Post in the project chat when the task runs there, otherwise in the thread. One message, newest things first, each with a link. End with the single most useful next step for the owner, if any.
