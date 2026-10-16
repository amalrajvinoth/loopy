#!/usr/bin/env python3
"""PostToolUse on Bash: after a git merge or pull, fix the conflicts that are only in built files.

Two pull requests that both touch src/ or a page always conflict in loopy.js, loopy.css, sw.js and
in the pages' security policy line, because those are generated. Merging them by hand is error
prone, so this takes either side and rebuilds them. Real conflicts are left for Claude.
"""
import json, pathlib, re, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import repo, duplicate, event, PLUGIN

root = repo()
data = event()
if root is None or duplicate(root):
    sys.exit(0)
cmd = (data.get("tool_input") or {}).get("command", "")
if not re.search(r"\bgit\s+(merge|pull|cherry-pick|rebase|stash\s+pop)\b", cmd):
    sys.exit(0)

p = subprocess.run([sys.executable, str(PLUGIN / "scripts/resolve_built.py")], cwd=root,
                   capture_output=True, text=True)
msg = (p.stdout + p.stderr).strip()
if msg:
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": msg}}))
