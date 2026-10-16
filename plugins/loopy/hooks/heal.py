#!/usr/bin/env python3
"""Stop: before Claude says it is done in loopy, run the fast checks and heal what is mechanical.

Self-healing, in two kinds:
- Fixed here, at once: stale built files or page policies (tools/build.py), and stale plugin
  copies in .claude/ (plugins/sync.py). Claude is then told to commit what changed.
- Sent back to Claude: an outside request (check_external.py), a "must" from tools/review.py, the
  plugin out of step with the repo (drift.py), or a failing hook test. Claude keeps working until
  they pass. The heal skill's recipes say how to fix each one.
Runs only when something changed (uncommitted files, or commits not on origin/main), and at most
once in a row (stop_hook_active), so it never loops.
"""
import json, pathlib, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import repo, duplicate, event, run

root = repo()
data = event()
if root is None or duplicate(root) or data.get("stop_hook_active"):
    sys.exit(0)


def git(*args):
    p = subprocess.run(["git", *args], cwd=root, capture_output=True, text=True)
    return p.stdout.strip() if p.returncode == 0 else ""


dirty = git("status", "--porcelain")
ahead = git("rev-list", "--count", "origin/main..HEAD") if git("rev-parse", "-q", "--verify", "origin/main") else ""
if not dirty and ahead in ("", "0"):
    sys.exit(0)
changed = set(git("diff", "--name-only", "origin/main...HEAD").splitlines()) | {l[3:] for l in dirty.splitlines()}
py = sys.executable
healed, broken = [], []

# 1. Plugin copies in .claude/ (only when plugins/ exists in this checkout).
if (root / "plugins/sync.py").is_file():
    ok, _ = run(root, py, "plugins/sync.py", "--check")
    if not ok:
        ok, out = run(root, py, "plugins/sync.py")
        (healed if ok else broken).append("plugin copies in .claude/ refreshed (plugins/sync.py)" if ok else "plugins/sync.py: " + out)

# 2. Built files and page policies.
ok, out = run(root, py, "tools/build.py", "--check")
if not ok and "Missing minifiers" in out:
    run(root, py, "-m", "pip", "install", "-q", "--require-hashes", "--no-binary", ":all:", "-r", "tools/requirements.txt", timeout=90)
    ok, out = run(root, py, "tools/build.py", "--check")
if not ok:
    if "Missing minifiers" in out:
        broken.append("tools/build.py --check could not run: the minifiers are missing and pip could not install them.")
    else:
        ok, out = run(root, py, "tools/build.py")
        (healed if ok else broken).append("loopy.js, loopy.css, sw.js and page policies rebuilt (tools/build.py)" if ok else "tools/build.py: " + out)

# 3. Checks only Claude can fix.
for name, cmd in [("check_external.py", [py, "tools/check_external.py"]),
                  ("review.py", [py, "tools/review.py"]),
                  ("drift.py", [py, "plugins/loopy/scripts/drift.py"]),
                  ("test_hooks.py", [py, "plugins/test_hooks.py"])]:
    if len(cmd) > 1 and not (root / cmd[1]).is_file():
        continue
    if name == "test_hooks.py" and not any(c.startswith("plugins/") for c in changed):
        continue
    ok, out = run(root, *cmd)
    if not ok:
        broken.append(f"{name} failed:\n{out}")

if healed or broken:
    parts = []
    if healed:
        parts.append("Healed: " + "; ".join(healed) + ". Commit and push these files with your change.")
    if broken:
        parts.append("Still failing (fix before you finish; see the heal skill's recipes.md, and add a recipe "
                     "if this failure is new):\n" + "\n\n".join(broken))
    print(json.dumps({"decision": "block", "reason": "\n\n".join(parts)}))
