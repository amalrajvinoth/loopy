"""Shared bits for the loopy hooks."""
import json, os, pathlib, subprocess, sys

PLUGIN = pathlib.Path(__file__).resolve().parent.parent


def repo():
    """The loopy checkout this session works in, or None when it is another project."""
    root = pathlib.Path(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()).resolve()
    if (root / "tools/build.py").is_file() and (root / "src/loopy.js").is_file():
        return root
    return None


def duplicate(root):
    """True when this hook runs from an installed copy of the plugin inside the loopy repo, where
    .claude/settings.json already runs the repo's own copy. Then only the repo's copy acts."""
    installed = os.environ.get("CLAUDE_PLUGIN_ROOT")
    if not installed or root is None:
        return False
    if pathlib.Path(installed).resolve() == (root / "plugins/loopy").resolve():
        return False
    settings = root / ".claude/settings.json"
    return settings.is_file() and "plugins/loopy/hooks" in settings.read_text(encoding="utf-8")


def event():
    try:
        return json.load(sys.stdin)
    except ValueError:
        return {}


def run(root, *cmd, timeout=100):
    """Run a command in the repo. Returns (ok, last lines of its output)."""
    try:
        p = subprocess.run(cmd, cwd=root, capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired) as e:
        return False, str(e)
    out = (p.stdout + p.stderr).strip().splitlines()
    return p.returncode == 0, "\n".join(out[-12:])
