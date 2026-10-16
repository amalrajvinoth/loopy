#!/usr/bin/env python3
"""SessionStart: put the owner's work-style rules in front of Claude.

Reads RULES.md from the repo copy first (plugins/work-style/RULES.md), so a rule added on a
branch is used at once, then falls back to the installed copy next to this file.
"""
import os, pathlib, sys

here = pathlib.Path(__file__).resolve().parent.parent
project = pathlib.Path(os.environ.get("CLAUDE_PROJECT_DIR", "."))
for path in (project / "plugins/work-style/RULES.md", here / "RULES.md"):
    if path.is_file():
        sys.stdout.write(path.read_text(encoding="utf-8"))
        break
