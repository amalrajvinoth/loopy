#!/usr/bin/env python3
"""PreToolUse on edits: keep two loopy rules without anyone having to remember them.

1. The built files (loopy.js, loopy.css, sw.js, the loopy-*.js parts and print.css at the repo root) are never edited by hand. They
   come from src/ through tools/build.py, and the GitHub check fails if they differ.
2. Pages never get style="..." attributes or on...= handlers. The strict security policy blocks
   them in the browser, so they would silently not work.
"""
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import repo, duplicate, event

BUILT = {"loopy.js", "loopy.css", "sw.js", "loopy-report.js", "loopy-backup.js", "loopy-sheet.js", "loopy-levels.js", "print.css"}
STYLE = re.compile(r"<[a-zA-Z][^>]*\sstyle\s*=", re.S)
HANDLER = re.compile(r"<[a-zA-Z][^>]*\son(click|dblclick|load|error|input|change|submit|reset|focus|blur|"
                     r"key(down|up|press)|mouse\w+|touch\w+|pointer\w+|drag\w*|drop|scroll|resize|"
                     r"animation\w+|transition\w+|wheel|contextmenu|select|toggle|play|pause|ended)\s*=",
                     re.S | re.I)

root = repo()
data = event()
if root is None or duplicate(root):
    sys.exit(0)
inp = data.get("tool_input") or {}
path = inp.get("file_path") or inp.get("notebook_path") or ""
if not path:
    sys.exit(0)
p = pathlib.Path(path)
p = (root / p) if not p.is_absolute() else p
try:
    rel = p.resolve().relative_to(root)
except ValueError:
    sys.exit(0)

if str(rel) in BUILT:
    sys.stderr.write(f"Blocked: {rel} is built from src/{rel} by tools/build.py. Edit src/{rel} instead, "
                     "then run python3 tools/build.py.\n")
    sys.exit(2)

if rel.suffix == ".html":
    new = [inp.get("content"), inp.get("new_string")]
    new += [e.get("new_string") for e in inp.get("edits") or [] if isinstance(e, dict)]
    text = "\n".join(t for t in new if isinstance(t, str))
    if STYLE.search(text):
        sys.stderr.write(f"Blocked: a style=\"...\" attribute in {rel}. loopy's security policy blocks inline "
                         "styles. Use a class in the page's <style> block or src/loopy.css.\n")
        sys.exit(2)
    if HANDLER.search(text):
        sys.stderr.write(f"Blocked: an on...= handler in {rel}. loopy's security policy blocks them. Use "
                         "addEventListener in the page's script.\n")
        sys.exit(2)
