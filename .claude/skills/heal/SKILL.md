---
name: heal
description: Find and fix whatever is failing in loopy, locally or on a pull request's CI, with known recipes. Use for "fix CI", "checks are red", "it's broken", a failed check notice, or a Stop hook failure.
---

<!-- Copied from plugins/loopy/skills/heal/ by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->

# Heal

Hooks fix the mechanical things by themselves: stale built files and page policies (the Stop hook runs `tools/build.py`), conflicts only in generated files (after_merge), stale plugin copies (`plugins/sync.py`). This skill fixes the rest with `recipes.md` next to this file, and adds a recipe for every new failure.

1. **Collect what fails.** Locally: `python3 tools/check.py`. It names the recipe for each red check. On a pull request: the failing check's log on the latest commit, and whether it conflicts with main. For a layout, speed or console failure, open the real page with the browser tools in `.mcp.json` when they are available, instead of guessing from the source.
2. **Look up one recipe. Do not read all of `recipes.md`.** Search it for a few words of the error, then read only the recipe that matches:
   ```sh
   grep -n -i -F "<words from the error>" .claude/skills/heal/recipes.md   # which line
   grep -n "^## " .claude/skills/heal/recipes.md                           # or every recipe title, as an index
   sed -n "<title line>,+5p" .claude/skills/heal/recipes.md                # that recipe alone
   ```
   Follow it.
3. **No recipe?** Find the root cause. Never skip, disable or loosen a check to get green; a "flake" needs proof: the same test passing on a re-run of the same commit. Fix it. Then add a recipe at the end of `plugins/loopy/skills/heal/recipes.md`, in four lines: a title, Looks like (the exact error text), Cause, Fix with the date. Run `python3 plugins/sync.py`.
4. **Same failure twice?** When a recipe was used before for the same cause, make it permanent: a hook, a check in `tools/`, or a step in a skill. Say so in the pull request.
5. Run the red checks again by name (`python3 tools/check.py <name>`). Push one validated fix. Reply only when it is green or blocked on something only the owner can do.
