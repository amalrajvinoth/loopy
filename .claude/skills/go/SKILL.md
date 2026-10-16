---
name: go
description: Build what the owner picked from a plan. Use when they answer a plan with a number, several numbers, "go", "use recommended", "approve and implement", "do all", or "yes".
---

<!-- Copied from plugins/work-style/skills/go/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Build the picked plan

1. Find the plan: the last plan file or numbered list in this conversation or thread. Read it again.
2. Work out what was picked:
   - numbers ("2, 3, 6") → those items;
   - "use recommended", "go", "yes" → the ⭐ items;
   - "approve and implement", "all", "do all" → every item that is not already done.
   Say in one line which items you are building. Skip any item that has shipped since the plan was written, and say so.
3. Build all picked items on one branch from the latest main branch, unless the plan said they should be separate pull requests.
4. Finish like any change in the repo: in loopy use the `ship-pr` skill (every check, screenshots, pull request).
5. Reply once with the pull request link and anything the owner should check by hand (a real phone, Safari, print).
