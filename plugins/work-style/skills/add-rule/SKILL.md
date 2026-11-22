---
name: add-rule
description: Record a new standing rule from the owner so later sessions follow it. Use for "from now on ...", "always ...", "never ...", "update memory and instructions", or when the catch_rule hook flags one.
---

# Add a rule

The owner states rules once and expects them to stick. A rule lives in four places; update all that this session can reach.

1. **Write it as one or two lines:** the rule, then why. Plain words. Every session reads the rules, so a how-to (commands, steps, exceptions) goes in the skill, recipe or check that uses it, and the rule only points there. Replace a rule this one changes; do not add a second line next to it. The date and where it came from go in `plugins/CHANGELOG.md`.
2. **Pick the plugin.** A rule about how the owner works in any repo (talking, git, pull requests) goes in `plugins/work-style/RULES.md`. A rule about loopy itself (games, data, design, checks) goes in `plugins/loopy/RULES.md`. Edit the copy in the loopy repo (`plugins/...`), never the installed copy under `~/.claude/plugins`, which is replaced on update.
3. **Make it enforced when it can be.** If a machine can check the rule, add it to a hook (for example `plugins/loopy/hooks/guard_files.py`) or to a skill's steps, so it does not depend on memory. Add a test case in `plugins/test_hooks.py` for any hook change.
4. **Project memory and instructions.** If this session has project memory, update the file for that subject. Claude cannot edit the claude.ai project instructions: give the owner the exact line to paste.
5. Run `python3 plugins/sync.py` (it copies plugin changes into `.claude/`, writes `AGENTS.md` and says when the rules or a skill grew past their size), then `python3 plugins/test_hooks.py`. Bump the plugin's `version` in `.claude-plugin/plugin.json` (minor for a new rule). Open a small pull request.
6. Reply in one line: the rule, where it now lives, and the line to paste into project instructions.
