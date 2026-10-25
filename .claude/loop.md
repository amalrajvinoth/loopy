Tend the current branch's pull request the loopy way, and stop when it is green and quiet.

1. `git fetch origin main && git merge origin/main` (the after_merge hook rebuilds built files). Then `python3 tools/build.py`.
2. Run the fast checks from the ship-pr skill: `tools/build.py --check`, `tools/csp.py --check`, `tools/check_external.py`, `tools/guide_check.py`, `tools/review.py`, `plugins/sync.py --check`, `plugins/loopy/scripts/drift.py`. Fix what fails with the heal skill, never by loosening a check.
3. If the pull request's CI is red, read the failing job's log and fix the cause (heal skill). If a review comment is new, address it or answer it, and resolve the thread.
4. Push one validated fix at a time. No new work, no new features.
5. When CI is green and nothing is pending, say so in one line and stop the loop.
