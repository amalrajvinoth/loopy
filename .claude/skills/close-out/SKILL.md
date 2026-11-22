---
name: close-out
description: Close out every loopy pull request that merged since the last look: issue closed and ticked on the roadmap, the RELEASES.md and What's new rows have their PR number, the deploy went live. Use with the built-in loop (`/loop 30m /close-out`), for "close out", "fill the PR numbers", or after a merge.
---

<!-- Copied from plugins/loopy/skills/close-out/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Close out merged pull requests

Ten commits in a month said only "RELEASES.md: the PR number". This skill does that chore, and the rest of `mark-done`, for every pull request that merged, in one small pull request. Made for a loop: each round looks again.

## One round

1. **Find what merged.** `gh api 'repos/amalrajvinoth/loopy/pulls?state=closed&sort=updated&direction=desc&per_page=20'`, keep the ones with `merged_at` set since the last round (the first round: the last two days). Nothing merged, nothing pending below: say "nothing to close out" and stop the loop.
2. **For each merged pull request**, the `mark-done` steps: its issue is closed (reason completed) and ticked in roadmap issue #21; a `Closes #N` in the body usually did the first.
3. **The release rows.** On a fresh `main`, read the `PR` column of `RELEASES.md`. An empty one belongs to a merged pull request: match by date and by what the row says, then write `[#N](https://github.com/amalrajvinoth/loopy/pull/N)`. The same row in the guide's What's new, `guide-src/src/content/docs/help/whats-new.md` and `de/help/whats-new.md`, carries no number, so leave those unless the row is missing there. A merged pull request that people can see (a new game, a page, a change in what is saved) and has no row at all gets one in all three places, in plain English; the `loopy-docs` skill has the wording.
4. **The deploy.** The Pages run for the merge commit should be green, including its "Live site check" job. A run that is red or still waiting after 30 minutes is a stuck deployment: the fix is any new commit to `main`, so say it in the report and let this skill's own pull request be that commit.
5. **One pull request** for the rows, on a branch `close-out/<date>`, titled "Release notes: the PR numbers", body "Docs: nothing people see changed" when only numbers changed. Run `python3 tools/guide_check.py` and `python3 tools/review.py` first. No pull request when nothing changed.
6. **Report in one line**: which pull requests were closed out and the link to the rows pull request, or "nothing to close out".

## Rules

- Never merge, never close an issue that a pull request did not finish, never tick a roadmap line whose pull request is still open.
- Project memory, where this session has it: one line in the roadmap part per closed-out pull request.
