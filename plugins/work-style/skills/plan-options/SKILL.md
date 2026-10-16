---
name: plan-options
description: Make a plan with numbered options and a recommendation, then wait for the owner to pick. Use for "Plan for X", "Plan to ...", "Brain-storm X", "what are the options", or any ask to think before building.
---

# Plan with numbered options

The owner asks "Plan for X" or "Brain-storm: X" and then picks a number. Nothing is built until they pick.

1. **Look first.** Read the code, docs and open issues or pull requests that touch X. If X is about the screen, take screenshots of how it looks today (in loopy: the 5 sizes in DESIGN.md "Screens", English and German). Note what other open work already covers, so the plan does not repeat it.
2. **Write the plan file.** In a project with a shared folder, save it as `<shared folder>/<short-topic>/README.md`; otherwise as `docs/plans/<short-topic>.md` on a branch. It has:
   - one line on the goal;
   - numbered options, each with what changes, what the owner will notice, and the cost or risk in one line;
   - before and after pictures for anything on screen (a mockup is fine);
   - the recommended option(s) marked ⭐, with one line on why.
3. **Reply short.** The numbered list, one line per option, ⭐ on the recommendation, and a link to the plan file. No more than 15 lines. End with what to type: a number, several numbers, "go" or "use recommended".
4. **Stop.** Do not build until the owner answers. Then use the `go` skill.

Keep options truly different (not the same idea in three sizes). Three to eight options. If the honest answer is "only one option makes sense", say so and give it.
