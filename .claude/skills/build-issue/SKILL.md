---
name: build-issue
description: Build one loopy GitHub issue end to end and open its pull request. Use for "Build #N", or when next-task hands over an issue.
---

<!-- Copied from plugins/loopy/skills/build-issue/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Build an issue

1. Read the issue and its comments, and the plan it links if any. Read DESIGN.md and the README "For developers" part if you have not in this session.
2. Branch from the latest `origin/main`.
3. Build it. For a new game use the `new-game` skill first. Follow `plugins/loopy/RULES.md`; the hooks stop the common slips (built files, `style=`, `on*=`).
4. Docs in the same pull request, with the loopy-docs skill: the guide (EN + DE), the game's README, the main README row, DESIGN.md if the look changed, FAQ and Help if a parent would ask about it, and RELEASES.md. Plain English.
5. Finish with the `ship-pr` skill. The pull request body says "Closes #N".
6. After it merges: the `mark-done` skill.
