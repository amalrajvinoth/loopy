---
name: mark-done
description: Close out loopy work after its pull request merges. Use for "Mark as done", "close it", or when a loopy pull request has merged.
---

<!-- Copied from plugins/loopy/skills/mark-done/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Mark as done

1. Check the pull request really merged.
2. Close its issue with reason "completed" if GitHub did not, and tick it in roadmap issue #21.
3. If it is a major change (a new game, page or feature people can see, or a change to what is saved), add a parent-friendly row at the top of `RELEASES.md` (date, what's new in one or two sentences, where, PR) in a small pull request, or in the next open one. The loopy-review skill step 10 has the wording rules.
4. Update project memory if this session has it (one line in the roadmap part).
5. Reply in one line, and resolve the thread if nothing is left.
