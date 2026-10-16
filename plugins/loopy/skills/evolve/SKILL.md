---
name: evolve
description: Update the loopy and work-style plugins so they keep up with the repo and with how the owner works. Use when drift.py reports the plugin is behind, for "evolve the plugin", "update the plugin", on the weekly plugin check, or after a run of merges.
---

# Evolve the plugins

The plugins learn from three sources. Look at all three, change what they show, and open one small pull request.

## 1. The repo moved (drift)
Run `python3 plugins/loopy/scripts/drift.py`. For each line, update what it names: a new CI step or tool goes into `ship-pr` step 3 and a recipe in `heal/recipes.md`; a new built file goes into `BUILT` in the hooks; a changed screen size into `screens.mjs`; a new repo skill into `ship-pr` and `RULES.md`; a changed PR template into `ship-pr` step 7; a new GAMES list into `new-game`.

## 2. The owner asked for something new (rules and habits)
Read what the owner asked since `learned_at` in `plugins/loopy/facts.json` (the project chat and threads when this session can read them, otherwise merged PR descriptions and review comments). Look for:
- a rule they stated ("from now on", "always", "never", "update memory and instructions") that is not in a `RULES.md` yet → add it (the add-rule skill);
- an ask they typed three or more times that no skill covers → a new skill, named after what they type, in `work-style` if it fits any repo, else in `loopy`;
- a skill whose steps they corrected ("no, do X instead") → fix the steps.

## 3. Work went wrong more than once (healing)
Read `plugins/loopy/skills/heal/recipes.md`. A recipe used for the same cause twice should become a hook or a check (heal skill step 4).

## Finish
1. `python3 plugins/sync.py` (copies into `.claude/`), `python3 plugins/test_hooks.py`, `claude plugin validate plugins/loopy` and `plugins/work-style` when the CLI is there.
2. `python3 plugins/loopy/scripts/drift.py --update`.
3. Bump `version` in each changed plugin's `.claude-plugin/plugin.json` (patch for fixes, minor for new skills or rules).
4. Add a line to `plugins/CHANGELOG.md`: date, version, what the plugin learned and from where.
5. One pull request, "Plugin: learn <what>". No screenshots needed. Reply with the link and the list of what changed, one line each.

Never let evolve loosen a rule, a check or a hook on its own. Removing or weakening one needs the owner's word.
