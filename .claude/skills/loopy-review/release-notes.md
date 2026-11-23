# The release note after a merge

Read after a pull request merges into main.

Decide if it is a **major** change:

- Major: a new game or page, a new feature people can see or use, a change to how a game plays or looks, a change to what is saved.
- Not major: typo or docs-only fixes, refactors nobody can see, CI and tooling, dependency bumps.

For a major change, add one row at the **top** of the table in `RELEASES.md`, and the same news in the guide's `help/whats-new.md` (English and German), and open a small pull request for it (or add it to the next pull request if one is open). Write it for parents, not developers:

| Date | What's new | Where | PR |
| --- | --- | --- | --- |
| 2026-10-15 | Print a worksheet: 20 problems at your child's level, with an answer page. | Plus and Minus, Times and Share, What Time Is It?, Sound Spell | #30 |

- **Date:** the merge date, YYYY-MM-DD.
- **What's new:** one or two short sentences. What can a child or grown-up do now? No code words.
- **Where:** the games or pages it touches.
- **PR:** the pull request number, as `#N`.

Use lowercase "loopy" if it appears. Do not add Claude attribution anywhere.
