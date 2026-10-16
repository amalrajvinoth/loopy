#!/usr/bin/env python3
"""After a merge in loopy: resolve conflicts that are only in generated files, then rebuild.

    python3 plugins/loopy/scripts/resolve_built.py

- loopy.js, loopy.css, sw.js: take either side; tools/build.py makes them again from src/.
- A page whose only conflicting lines are its security policy line: take either side; tools/csp.py
  (run by build.py) writes the right policy again.
- Anything else stays a conflict for a person (or Claude) to resolve.
Then, when src/ has no conflicts left, it runs tools/build.py and stages what it fixed.
Prints what it did; prints nothing when there was nothing to do.
"""
import pathlib, re, subprocess, sys

ROOT = pathlib.Path.cwd()
BUILT = ["loopy.js", "loopy.css", "sw.js", "loopy-report.js", "loopy-backup.js", "loopy-sheet.js", "print.css"]
META = re.compile(r'^\s*<meta http-equiv="Content-Security-Policy" content="[^"]*">\s*$')


def git(*args, check=False):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=check).stdout


def only_policy(text):
    """The file with every conflict taken from our side, or None if a conflict touches other lines."""
    out, side, hunk = [], None, {"ours": [], "base": [], "theirs": []}
    for line in text.splitlines(keepends=True):
        if line.startswith("<<<<<<< "):
            side, hunk = "ours", {"ours": [], "base": [], "theirs": []}
        elif side and line.startswith("||||||| "):
            side = "base"
        elif side and line.rstrip("\r\n") == "=======":
            side = "theirs"
        elif side and line.startswith(">>>>>>> "):
            lines = hunk["ours"] + hunk["base"] + hunk["theirs"]
            if not all(META.match(x) or not x.strip() for x in lines):
                return None
            out += hunk["ours"]
            side = None
        elif side:
            hunk[side].append(line)
        else:
            out.append(line)
    return "".join(out) if side is None else None


def main():
    if not (ROOT / "tools/build.py").is_file():
        return
    unmerged = [f for f in git("diff", "--name-only", "--diff-filter=U").splitlines() if f]
    fixed, left = [], []
    for f in unmerged:
        if f in BUILT:
            git("checkout", "--ours", "--", f)
            fixed.append(f)
        elif f.endswith(".html"):
            merged = only_policy((ROOT / f).read_text(encoding="utf-8"))
            if merged is None:
                left.append(f)
            else:
                (ROOT / f).write_text(merged, encoding="utf-8")
                fixed.append(f)
        else:
            left.append(f)

    in_merge = bool(git("rev-parse", "-q", "--verify", "MERGE_HEAD").strip())
    src_open = [f for f in left if f.startswith("src/")]
    notes = []
    if fixed:
        notes.append("loopy: took either side of the generated parts of " + ", ".join(fixed) + ".")
    if src_open:
        notes.append("loopy: src/ still has conflicts (" + ", ".join(src_open) + "). Resolve them, then run "
                     "python3 tools/build.py to rebuild loopy.js, loopy.css, sw.js and the page policies.")
    else:
        check = subprocess.run([sys.executable, "tools/build.py", "--check"], cwd=ROOT, capture_output=True, text=True)
        if check.returncode != 0 or fixed:
            build = subprocess.run([sys.executable, "tools/build.py"], cwd=ROOT, capture_output=True, text=True)
            if build.returncode != 0:
                notes.append("loopy: tools/build.py failed after the merge:\n" + (build.stdout + build.stderr).strip()[-1500:])
            else:
                changed = [f for f in git("diff", "--name-only").splitlines() if (f in BUILT or f.endswith(".html")) and f not in left] + fixed
                if changed:
                    git("add", "--", *sorted(set(changed)))
                notes.append("loopy: rebuilt loopy.js, loopy.css, sw.js and the page policies from the merged src/ "
                             "and staged them." + ("" if in_merge else " Commit them."))
    if left:
        notes.append("loopy: these still need a real merge by hand: " + ", ".join(left) + ".")
    if notes:
        print("\n".join(notes))


if __name__ == "__main__":
    main()
