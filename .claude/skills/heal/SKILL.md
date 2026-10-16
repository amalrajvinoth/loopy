---
name: heal
description: Find and fix whatever is failing in loopy, locally or on a pull request's CI, using known recipes, and learn a recipe for anything new. Use for "fix CI", "checks are red", "it's broken", a failed check notice, or when the Stop hook reports a failure.
---

<!-- Copied from plugins/loopy/skills/heal/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Heal

loopy heals in three layers:
- **Hooks fix the mechanical things by themselves:** stale built files and page policies (Stop hook runs `tools/build.py`), conflicts that are only in generated files (after_merge hook), stale plugin copies (`plugins/sync.py`).
- **This skill fixes the rest** with the recipes in `recipes.md` next to this file.
- **It learns:** every failure that has no recipe gets one, so the next time it is quick.

## Steps

1. **Collect what fails.** Locally, run the checks in the `ship-pr` skill step 3. On a pull request, read the failing check's log on the latest commit, and whether it conflicts with main.
2. **Match each failure to a recipe** in `recipes.md` by its "Looks like" line. Follow the recipe.
3. **No recipe?** Find the root cause (never skip, disable or loosen a check to get green; a "flake" needs proof: the same test passing on a re-run of the same commit). Fix it. Then add a recipe at the end of `recipes.md`: Looks like (the exact error text to match), Cause, Fix, and the date. Keep it to four lines.
4. **Same failure twice?** If a recipe was used before for the same cause, make it permanent instead: a hook, a check in `tools/`, or a step in a skill, so it cannot happen again. Say so in the PR.
5. Re-run the checks. Push one validated fix. Reply only when it is green or blocked on something only the owner can do.
