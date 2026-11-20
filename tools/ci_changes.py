#!/usr/bin/env python3
"""Which of the long CI checks does a change need?

    python3 tools/ci_changes.py BASE HEAD     prints site=true|false and guide=true|false
    python3 tools/ci_changes.py --pages BASE HEAD     prints the pages Lighthouse scores for this change, one site path per line

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


# Lighthouse on a pull request: the home page, every page the change touches, and, when a shared file changed
# (src/, fonts, the built loopy.js or loopy.css), three pages that between them load every shared part. At most LIGHTHOUSE_MAX pages.
LIGHTHOUSE_MAX = 6
SHARED = re.compile(r"^(src/.*|fonts/.*|loopy.*\.js|loopy\.css|print\.css|sw\.js)$")
SAMPLE = ["math/make-10/", "languages/word-detective/", "progress/"]


def lighthouse_pages(changes):
    pages = [""]
    for status, path in changes:
        if path.endswith("index.html") and status[0] != "D" and not path.startswith(("guide-src/", "docs/", "help/privacy")):
            page = path[:-len("index.html")]
            if page not in pages:
                pages.append(page)
    if any(SHARED.match(path) for _, path in changes):
        pages += [p for p in SAMPLE if p not in pages]
    return pages[:LIGHTHOUSE_MAX]


def needs(changes):
    """changes: (status, path) pairs from git diff --name-status. Returns (site, guide)."""
    site = guide = False
    for status, path in changes:
        if not (DOCS.match(path) or GUIDE_ONLY.match(path)):
            site = True
        if GUIDE.match(path) or (status[0] in "ADR" and not DOCS.match(path)):
            guide = True
    return site, guide


def main(base, head, pages=False):
    out = subprocess.run(["git", "diff", "--name-status", "-M", base, head], capture_output=True, text=True, check=True).stdout
    changes = []
    for line in out.splitlines():
        parts = line.split("\t")
        changes += [(parts[0], p) for p in parts[1:]]  # a rename names the old and the new path
    if pages:
        print("\n".join(lighthouse_pages(changes)))
        return
    site, guide = needs(changes)
    for status, path in changes:
        print(f"{status}\t{path}", file=sys.stderr)
    print(f"site={'true' if site else 'false'}")
    print(f"guide={'true' if guide else 'false'}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--pages"]
    if len(args) != 2:
        sys.exit(__doc__)
    main(args[0], args[1], pages="--pages" in sys.argv)
