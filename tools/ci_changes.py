#!/usr/bin/env python3
"""Which of the long CI checks does a change need?

    python3 tools/ci_changes.py BASE HEAD     prints site=true|false and guide=true|false

CI writes the answer into the job outputs. The fast safety checks (csp, check_external,
guide_check, build --check, plugins) always run, whatever this says.

site:  the browser tests (accessibility, play, Try again). They open the pages, so they are
       needed for any change except the files listed in DOCS, which no page loads.
guide: the guide build and check. Needed when the guide, the tools it uses or a workflow
       change, or when a file is added, removed or renamed (the guide links to pages by address).

When in doubt it says true: a missing pattern costs ten minutes, never a skipped check.
"""
import re, subprocess, sys

# Files no page, test or guide build reads.
DOCS = re.compile(r"""^(
    .*\.md                               # README, RELEASES, FAQ, DESIGN, every game README
  | docs/.*                              # PR screenshots
  | images/.*
  | \.claude/.*                          # Claude Code skills, hooks and settings
  | plugins/.*                           # the Claude Code plugins (checked by the fast job)
  | \.github/(?!workflows/).*            # issue forms, PR template, Dependabot
  | \.gitignore | \.gitattributes | LICENSE
)$""", re.X)
GUIDE_ONLY = re.compile(r"^guide-src/")
# What the guide job runs besides guide-src/.
GUIDE = re.compile(r"^(guide-src/.* | icon\.svg | tools/(csp|check_external|ci_changes)\.py | tools/a11y/.* | \.github/workflows/.*)$", re.X)


def needs(changes):
    """changes: (status, path) pairs from git diff --name-status. Returns (site, guide)."""
    site = guide = False
    for status, path in changes:
        if not (DOCS.match(path) or GUIDE_ONLY.match(path)):
            site = True
        if GUIDE.match(path) or (status[0] in "ADR" and not DOCS.match(path)):
            guide = True
    return site, guide


def main(base, head):
    out = subprocess.run(["git", "diff", "--name-status", "-M", base, head], capture_output=True, text=True, check=True).stdout
    changes = []
    for line in out.splitlines():
        parts = line.split("\t")
        changes += [(parts[0], p) for p in parts[1:]]  # a rename names the old and the new path
    site, guide = needs(changes)
    for status, path in changes:
        print(f"{status}\t{path}", file=sys.stderr)
    print(f"site={'true' if site else 'false'}")
    print(f"guide={'true' if guide else 'false'}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
