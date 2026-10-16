---
name: apply-suggestions
description: Apply every review suggestion on a pull request. Use for "apply all suggestion", "apply the review", "do what the reviewer said", or "fix the comments".
---

<!-- Copied from plugins/work-style/skills/apply-suggestions/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Apply all suggestions

1. Read every review comment and suggestion on the pull request, open ones first, from people and from review bots.
2. Apply each one that is correct. A review bot's note is a claim to check, not an order: if it is wrong or costs more code than it saves, do not apply it, and answer its thread in one line saying why.
3. Run the repo's checks. Push one commit (or a few clear ones), not one per comment.
4. Reply on each thread you fixed ("Fixed in <commit>") and resolve it. Answer every thread you did not fix.
5. Reply to the owner in one line: how many were applied and which were left, with why.
