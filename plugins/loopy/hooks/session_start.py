#!/usr/bin/env python3
"""SessionStart in loopy: get the tools ready, then give Claude the loopy rules and any drift.

1. Installs the minifiers (tools/requirements.txt, checked by hash) and the play test and
   accessibility check packages (tools/a11y) when they are missing, so every check can run.
2. Prints plugins/loopy/RULES.md (the repo copy, so a rule added on this branch counts at once).
3. Prints what drift.py finds, so Claude knows when the plugin is behind the repo.
"""
import importlib.util, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import repo, duplicate, event, run, PLUGIN

root = repo()
event()
if root is None or duplicate(root):
    sys.exit(0)
py, notes = sys.executable, []

if importlib.util.find_spec("rjsmin") is None or importlib.util.find_spec("rcssmin") is None:
    ok, out = run(root, py, "-m", "pip", "install", "-q", "--require-hashes", "--no-binary", ":all:",
                  "-r", "tools/requirements.txt", timeout=90)
    notes.append("Installed the minifiers for tools/build.py." if ok else "Could not install the minifiers: " + out)
if not (root / "tools/a11y/node_modules/playwright-core").is_dir():
    ok, out = run(root, "npm", "ci", "--prefix", "tools/a11y", "--ignore-scripts", "--no-audit", "--no-fund", timeout=150)
    notes.append("Installed the play test and accessibility check packages." if ok
                 else "Could not install tools/a11y packages (play test and accessibility check): " + out)

rules = root / "plugins/loopy/RULES.md"
print((rules if rules.is_file() else PLUGIN / "RULES.md").read_text(encoding="utf-8"))
drift = root / "plugins/loopy/scripts/drift.py"
if drift.is_file():
    ok, out = run(root, py, str(drift), "--quiet")
    if not ok:
        notes.append(out)
if notes:
    print("## Session notes\n" + "\n".join("- " + n for n in notes))
