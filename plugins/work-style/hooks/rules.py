#!/usr/bin/env python3
"""SessionStart: put the owner's work-style rules in front of Claude.

Reads RULES.md from the repo copy first (plugins/work-style/RULES.md), so a rule added on a
branch is used at once, then falls back to the installed copy next to this file.

Prints nothing when the project's AGENTS.md already holds these rules (in loopy, plugins/sync.py
writes them there under "How the owner works" and CLAUDE.md loads that file), so a session does
not read them twice, at start and again on every resume.
"""
import os, pathlib, sys

here = pathlib.Path(__file__).resolve().parent.parent
project = pathlib.Path(os.environ.get("CLAUDE_PROJECT_DIR", "."))
agents, claude = project / "AGENTS.md", project / "CLAUDE.md"
if (agents.is_file() and "## How the owner works" in agents.read_text(encoding="utf-8")
        and claude.is_file() and "@AGENTS.md" in claude.read_text(encoding="utf-8")):
    sys.exit(0)
for path in (project / "plugins/work-style/RULES.md", here / "RULES.md"):
    if path.is_file():
        sys.stdout.write(path.read_text(encoding="utf-8"))
        break
