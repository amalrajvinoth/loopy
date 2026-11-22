---
name: close-out
description: Close out every loopy pull request that merged since the last look: issue closed and ticked on the roadmap, the RELEASES.md and What's new rows have their PR number, the deploy went live. Use with the built-in loop (`/loop 30m /close-out`), for "close out", "fill the PR numbers", or after a merge.
---

# Close out merged pull requests

Ten commits in a month said only "RELEASES.md: the PR number". This skill does that chore, and the rest of `mark-done`, for every pull request that merged, in one small pull request. Made for a loop: each round looks again.

## One round

1. **Find what merged.** `gh api 'repos/amalrajvinoth/loopy/pulls?state=closed&sort=updated&direction=desc&per_page=100&page=N'`, page by page until a page is empty or every pull request on it was updated before the last round, and keep the ones with `merged_at` set since the last round (the first round: the last two days). A merge counts as closed out only when steps 2 to 4 are done for it; one that is not (a request failed, a deployment still waiting) stays on your list for the next round, and the round's time moves forward only past the ones that are done. When this loop was started on a branch whose pull request is still open, that pull request is the one you are waiting for: say "waiting for #N to merge" and keep going. Nothing merged, nothing unfinished, nothing waited for: say "nothing to close out" and stop the loop.
2. **For each merged pull request**, the `mark-done` steps: its issue is closed (reason completed) and ticked in roadmap issue #21; a `Closes #N` in the body usually did the first.
3. **The release rows.** On a fresh `main`, read the `PR` column of `RELEASES.md`. An empty one belongs to a merged pull request: match by date and by what the row says, then write `[#N](https://github.com/amalrajvinoth/loopy/pull/N)`. The same row in the guide's What's new, `guide-src/src/content/docs/help/whats-new.md` and `de/help/whats-new.md`, carries no number, so leave those unless the row is missing there. A merged pull request that people can see (a new game, a page, a change in what is saved) and has no row at all gets one in all three places, in plain English; the `loopy-docs` skill has the wording.
4. **The deploy.** The Pages run for the merge commit should be green, including its "Live site check" job. A run still waiting after 30 minutes, or red in its deploy job with no deployment status from GitHub Pages, is a stuck deployment: the fix is any new commit to `main`. Any other red run is a bug: read the failing job's log first (the `heal` skill and its recipes), fix the cause or report it, and never treat a new commit or a re-run as the fix for it. When this round has rows to fix, its pull request is that commit. When it has none, say so in the report and name the fix for the owner: merge any waiting pull request, or run Actions → Pages by hand. Never make an empty commit for it.
5. **One pull request** for the rows, on a branch `close-out/<date>`, titled "Release notes: the PR numbers", body "Docs: nothing people see changed" when only numbers changed. Run `python3 tools/guide_check.py` and `python3 tools/review.py` first. No pull request when nothing changed.
6. **Report in one line**: which pull requests were closed out and the link to the rows pull request, or "nothing to close out".

## Rules

- Never merge, never close an issue that a pull request did not finish, never tick a roadmap line whose pull request is still open.
- Project memory, where this session has it: one line in the roadmap part per closed-out pull request.
