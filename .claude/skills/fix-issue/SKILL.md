---
name: fix-issue
description: Fix a GitHub issue end to end. Use when the owner sends "fix: <issue link>", "fix #N", "fix this bug", or pastes a bug report.
---

<!-- Copied from plugins/work-style/skills/fix-issue/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Fix an issue

A bug report is a request for the fix, not for a diagnosis.

1. Read the issue, its comments and any screenshot. Note the page, language, age, screen size and browser it names.
2. **Reproduce it** before changing code: a small script, a Playwright run at the size it names, or a failing test. If it does not reproduce, say what you tried and ask one short question.
3. Find the cause. Fix the cause, not the symptom. Keep the fix small.
4. Add a check that would have caught it when the repo has a place for one (in loopy: `tools/e2e/play.mjs`, `tools/review.py` or `tools/a11y/check.mjs`).
5. Finish with the repo's ship steps (in loopy: the `ship-pr` skill). The pull request body says "Closes #N".
6. Reply with the link and one line on what caused it.
