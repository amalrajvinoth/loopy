#!/usr/bin/env python3
"""PreToolUse: block Claude attribution in commits, pull requests and GitHub comments.

The owner asked for no Claude attribution anywhere in the repo (15 Oct 2026). This stops a
commit message or a pull request / comment body that carries it, and tells Claude why, so it
retries without it. The project's "Requested by" line (a claude.ai/code/project link) is allowed.
"""
import json, re, sys

BAD = [
    (re.compile(r"Co-Authored-By:\s*Claude", re.I), "a \"Co-Authored-By: Claude\" line"),
    (re.compile(r"Claude-Session:", re.I), "a \"Claude-Session\" line"),
    (re.compile(r"Generated (with|by) \[?Claude Code", re.I), "a \"Generated with Claude Code\" line"),
    (re.compile(r"claude\.ai/code/session_", re.I), "a Claude session link"),
]
# Text fields of GitHub tools that end up in the repo or on GitHub.
FIELDS = ("body", "message", "commit_message", "commitMessage", "title", "commit_title")


def texts(tool, data):
    if tool == "Bash":
        cmd = data.get("command", "")
        # Only commands that write to git or GitHub (as a command, not text inside a file being written).
        if re.search(r"(^|[;&|(]|\n)\s*(git\s+(-C\s+\S+\s+)?(commit|tag|merge|notes)\b|gh\s+(pr|issue|api|release)\b)", cmd):
            yield cmd
    else:
        for key in FIELDS:
            if isinstance(data.get(key), str):
                yield data[key]


try:
    event = json.load(sys.stdin)
except ValueError:
    sys.exit(0)
tool, data = event.get("tool_name", ""), event.get("tool_input") or {}
for text in texts(tool, data):
    for pattern, what in BAD:
        if pattern.search(text):
            sys.stderr.write(
                f"Blocked: {what} is Claude attribution. The owner asked for none in commits, pull "
                "requests or GitHub comments (keep only the project's \"Requested by\" line). Remove it "
                "and try again.\n")
            sys.exit(2)
