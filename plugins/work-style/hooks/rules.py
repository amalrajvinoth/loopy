#!/usr/bin/env python3
"""SessionStart: put the owner's work-style rules in front of Claude.

Reads RULES.md from the repo copy first (plugins/work-style/RULES.md), so a rule added on a
branch is used at once, then falls back to the installed copy next to this file.

Prints nothing when the project's AGENTS.md already holds every one of these rules (in loopy,
plugins/sync.py writes them there under "How the owner works") and CLAUDE.md loads that file, so
a session does not read them twice, at start and again on every resume. A heading with no rules
under it, or an AGENTS.md that misses a rule, does not count: the rules are printed. So does
"@AGENTS.md" inside backticks or a code block, which Claude Code does not load.
"""
import os, pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent.parent
project = pathlib.Path(os.environ.get("CLAUDE_PROJECT_DIR", "."))
rules = next((p.read_text(encoding="utf-8") for p in (project / "plugins/work-style/RULES.md", here / "RULES.md") if p.is_file()), "")
agents, claude = project / "AGENTS.md", project / "CLAUDE.md"
loads = claude.is_file() and re.sub(r"(?ms)^(```|~~~).*?^\1[^\n]*$|`[^`\n]*`", "", claude.read_text(encoding="utf-8"))
if agents.is_file() and loads and re.search(r"(?<!\S)@AGENTS\.md\b", loads):
    held = agents.read_text(encoding="utf-8")
    lines = [line for line in rules.splitlines() if line.startswith("- ")]
    if "## How the owner works" in held and lines and all(line in held for line in lines):
        sys.exit(0)
sys.stdout.write(rules)
