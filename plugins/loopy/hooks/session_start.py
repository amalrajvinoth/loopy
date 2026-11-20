#!/usr/bin/env python3
"""SessionStart in loopy: get the tools ready, then give Claude the loopy rules and any drift.

1. Installs the minifier and type checker (tools/build, exact versions from the lock file) and the play test
   and accessibility check packages (tools/a11y) when they are missing, so every check can run.
2. Prints plugins/loopy/RULES.md (the repo copy, so a rule added on this branch counts at once) when the
   checkout has no CLAUDE.md yet; since 20 Nov 2026 CLAUDE.md loads AGENTS.md, which plugins/sync.py writes
   from RULES.md, so Claude Code reads the rules by itself and this hook does not print them twice.
3. Prints what drift.py finds, so Claude knows when the plugin is behind the repo.
"""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import repo, duplicate, event, run, PLUGIN

root = repo()
event()
if root is None or duplicate(root):
    sys.exit(0)
py, notes = sys.executable, []

if (root / "tools/build/package-lock.json").is_file() and not (root / "tools/build/node_modules/esbuild").is_dir():
    ok, out = run(root, "npm", "ci", "--prefix", "tools/build", "--ignore-scripts", "--no-audit", "--no-fund", timeout=150)
    notes.append("Installed the minifier and type checker for tools/build.py (tools/build)." if ok
                 else "Could not install tools/build packages (minifier and type check): " + out)
if not (root / "tools/a11y/node_modules/playwright-core").is_dir():
    ok, out = run(root, "npm", "ci", "--prefix", "tools/a11y", "--ignore-scripts", "--no-audit", "--no-fund", timeout=150)
    notes.append("Installed the play test and accessibility check packages." if ok
                 else "Could not install tools/a11y packages (play test and accessibility check): " + out)

rules = root / "plugins/loopy/RULES.md"
if not (root / "CLAUDE.md").is_file():
    print((rules if rules.is_file() else PLUGIN / "RULES.md").read_text(encoding="utf-8"))
drift = root / "plugins/loopy/scripts/drift.py"
if drift.is_file():
    ok, out = run(root, py, str(drift), "--quiet")
    if not ok:
        notes.append(out)
if notes:
    print("## Session notes\n" + "\n".join("- " + n for n in notes))
