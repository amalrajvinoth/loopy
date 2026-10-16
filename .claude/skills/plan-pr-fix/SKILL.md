---
name: plan-pr-fix
description: Read a pull request and plan how to get it merged. Use for "Plan to fix: <PR link>", "what's wrong with PR N", or "why is this PR stuck".
---

<!-- Copied from plugins/work-style/skills/plan-pr-fix/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Plan to fix a pull request

1. Read the pull request: description, diff, every review comment (open and resolved), the checks on the latest commit and their logs, and whether it conflicts with the main branch.
2. Sort what you find:
   - **Blocking:** red checks, merge conflict, review comments asking for a change.
   - **Worth doing:** optional review notes that are plainly right.
   - **Leave:** notes that are wrong or not worth the code, each with one line why.
3. Reply with numbered steps, ⭐ on the recommended set, each one line. Link to the failing check or comment. Put long details in a file.
4. Stop and wait for "go", "use recommended" or numbers. Then do them on the pull request's own branch (merge the main branch in; never rebase or force-push someone else's branch), run the repo's checks, push, and reply when the checks are green.
