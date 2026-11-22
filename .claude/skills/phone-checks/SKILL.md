---
name: phone-checks
description: Keep the one "Phone checks" issue current: what only a real phone or tablet can show, from merged pull requests, struck out when a later change covered it. Use with the built-in loop (`/loop 1h /phone-checks`), for "phone checks", "what should I check on the phone", or after a merge.
---

<!-- Copied from plugins/loopy/skills/phone-checks/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Phone checks

Some things only a real phone shows: the home screen app's bottom bar, a Pixel's keyboard, how a German wrong-answer line reads to a child. Those waited in notes nobody could find. Now they live in one GitHub issue, titled **Phone checks**, label `phone check`, with a tick box per item. The owner ticks what they looked at. This skill keeps the list.

## One round

1. **Find the issue.** Open issues with the label `phone check`; the title is "Phone checks". None: make it, with the lines from step 2 and this sentence on top: "What to look at on a real phone or tablet, newest first. Tick what you checked. Claude adds a line per merged pull request and strikes out what a later change covered."
2. **Add what merged.** The issue body ends with a hidden line `<!-- phone-checks: last <merged_at of the newest pull request taken> -->`; the owner's ticks move the issue's `updated_at`, so never use that. A new issue has no such line: its first scan takes the last 30 days. For every pull request merged at or after that time (`gh api` pulls with `state=closed`, by `merged_at`; GitHub times are whole seconds, so a merge in the same second as the line's time must not be lost), read the body, and skip a pull request whose `#N` is already in the issue. Then move the hidden line forward. The lines under a **Check on a phone** heading, or a sentence that asks for a look on a phone or tablet, become one tick box each: `- [ ] <what to look at> (#N, <game or page>)`. Newest first. Nothing to check: no line.
3. **Strike out what is covered.** A later merged pull request covers an older item only when its body says it does: it names the item, or the same thing to look at, as fixed or changed again. The same page changing is not enough: a new top row does not cover a check of the bottom bar. Then make it `- [x] ~~…~~ covered by #M`. Do not strike out an item because time passed.
4. **Trim.** Items the owner ticked more than 30 days ago move to a "Checked" fold (`<details>`) at the bottom, so the top stays short. Never delete a line.
5. **Write it back.** Read the issue again right before you write, take the owner's ticks from that fresh body into yours (a box the owner ticked stays ticked), and only then `PATCH repos/amalrajvinoth/loopy/issues/N` with the whole body. If the fresh body's `updated_at` moved while you wrote, read and merge once more. No footer lines. Nothing changed: say "phone checks are current" and stop the loop.
6. **Report in one line**: how many items are open and the link.

## Rules

- Only the owner ticks a box for a look taken; this skill ticks only with a strike-out and the covering pull request.
- The `ship-pr` skill fills the **Check on a phone** section of the pull request template, so step 2 has something to read. A pull request with nothing to check on a phone deletes that section.
