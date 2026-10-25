# Plugin changes

Newest first. One line per change: date, plugin and version, what it learned, and from where.

| Date | Plugin | What changed | Learned from |
| --- | --- | --- | --- |
| 2026-10-25 | loopy 1.4.1 | Knows `tools/ralph/` (the Ralph loop's helpers `issue.py` and `status.py`); the loop runs the same checks as ship-pr. | Owner's ask "implement ralph loop", loopy project 25 Oct 2026 |
| 2026-10-25 | loopy 1.4.0 | New weekly-check skill: the Monday loop that says nothing unless something needs the owner, run by the project's scheduled task. heal has recipes for the three new workflows (Live site check, Dependabot merge, Lighthouse). ship-pr knows `.claude/loop.md`. | Loops plan, loopy project 25 Oct 2026 |
| 2026-10-23 | loopy 1.3.1 | ship-pr runs the new levels test; heal has a recipe for it. | Levels follow the child (#138), loopy project 23 Oct 2026 |
| 2026-10-22 | loopy 1.3.0 | New loopy-docs skill: which docs a change touches (guide EN + DE, FAQ, Help, READMEs, RELEASES.md) and how to write them in plain English. ship-pr, build-issue, new-game and loopy-review point at it. `tools/review.py` warns about missed docs. | Owner's ask "docs up to date for every commit" (#127), loopy project 21 Oct 2026 |
| 2026-10-21 | loopy 1.2.1 | ship-pr runs the new offline copy test; heal has a recipe for phones that keep an old page. | Android blank Print (#123), loopy project 21 Oct 2026 |
| 2026-10-20 | loopy 1.2.0 | ship-pr and heal know the faster CI: the a11y and play halves, skipped long checks, "All checks", one heal recipe. | Faster checks (#119), loopy project 20 Oct 2026 |
| 2026-10-20 | loopy 1.1.0 | new-game, ship-pr and heal know the guide: a guide page per game, the guide build and check, two heal recipes. | The guide (guide-src/), loopy project 20 Oct 2026 |
| 2026-10-16 | work-style 1.0.0, loopy 1.0.0 | First version: 15 skills, 7 hooks, 3 agents, drift check, heal recipes. | The owner's asks in the loopy project (15 and 16 Oct 2026), project instructions and memory |
