#!/usr/bin/env python3
"""Which of the long CI checks does a change need, and on which pages?

    python3 tools/ci_changes.py BASE HEAD           the plan, one key=value per line (CI writes it into the job outputs)
    python3 tools/ci_changes.py --all               the plan that runs everything (pushes to main)
    python3 tools/ci_changes.py --pages BASE HEAD   the pages Lighthouse scores for this change, one site path per line

The fast safety checks (csp, check_external, guide_check, build --check, lints, plugins) always run, whatever this says.

The plan:
    a11y, play, retry, pictures   "all" (every page), "none" (skip the job), or a JSON list of the pages to test,
                                  such as ["math/plus-minus/"]. The tests read it from PAGES.
    extras                        a JSON list of the other browser tests in the Try again job to run:
                                  offline, sync, levels, switch, hello.
    lighthouse                    true or false (which pages: --pages).
    site                          true when any browser test runs.
    guide                         the guide build and check. Needed when the guide, the tools it uses or a workflow
                                  change, or when a file is added, removed or renamed (the guide links to pages by address).

How a changed file counts, first match wins (RULES, then the pages):
    - Docs, pictures for the README, .claude/, plugins/: no browser test.
    - A test or its saved pictures: that test, on every page. The Family sync server: the sync test.
    - Tools the fast job runs (lints, build, review, the Mac-only scripts): no browser test.
    - A file inside a page's folder (its index.html, words.js, data.js ...), or a file a page loads from another
      folder (languages/words.js, ../spelling-quiz/words.js): that page and every page that loads the file.
    - Anything else (src/, loopy.js, loopy.css, fonts, icons, the test browsers, checks.yml, a page that was
      deleted, a file nobody claims): every test on every page.

When in doubt it runs everything: a missing pattern costs ten minutes, never a skipped check.
"""
import json, pathlib, posixpath, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALL = "all"
JOBS = ("a11y", "play", "retry", "pictures")
EXTRAS = ("offline", "sync", "levels", "switch", "hello")

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

# Files that need only some browser tests (or none), whatever page: (pattern, {test: ALL}). First match wins.
RULES = [
    (DOCS, {}),
    (GUIDE_ONLY, {}),
    # The Family sync server: the sync test loads sync/worker.js (sync/test.mjs runs in the fast job).
    (re.compile(r"^sync/"), {"sync": ALL}),
    # A test, or the pictures the picture test compares with: that test on every page it covers.
    (re.compile(r"^tools/e2e/pictures(/.*|\.mjs)$"), {"pictures": ALL}),
    (re.compile(r"^tools/e2e/(play|retry)\.mjs$"), lambda m: {m.group(1): ALL}),
    (re.compile(r"^tools/e2e/(offline|sync|levels|switch|hello)\.mjs$"), lambda m: {m.group(1): True}),
    (re.compile(r"^tools/a11y/check\.mjs$"), {"a11y": ALL}),
    (re.compile(r"^tools/lighthouse/"), {"lighthouse": True}),
    # Run by the fast job only, or on the owner's Mac: lints, the build and policy scripts (a change in what they
    # write shows up in the files they write), review, the check list, the sync report scripts, the Ralph loop.
    (re.compile(r"""^tools/(build/.* | lint/.* | ralph/.* | build\.py | csp\.py | check_external\.py | guide_check\.py
                 | review\.py | check\.py | sync-[a-z]+(\.test)?\.mjs)$""", re.X), {}),
    # The other workflows: zizmor and actionlint check them in the fast job. checks.yml runs the tests: everything.
    (re.compile(r"^\.github/workflows/(?!checks\.yml$)"), {}),
    # The built offline helper lists every saved file with its hash, so it changes with any page. Its own code
    # is src/sw.js (everything); the list is what the offline test checks.
    (re.compile(r"^sw\.js$"), {"offline": True}),
]
# Files outside a page folder that belong to one page all the same: the tools that write its data.
OWNED = {re.compile(r"^tools/chess/"): "brain/chess-puzzles/"}

# Lighthouse on a pull request: the home page, every page the change touches (its own index.html, or its words.js or
# data.js next to it) and, when a shared file changed (src/, fonts, the built loopy.js or loopy.css), three pages that
# between them load every shared part. No page a change touches is left out: a change to every page scores every page
# (about three runs of eight seconds each per page).
SHARED = re.compile(r"^(src/.*|fonts/.*|loopy.*\.js|loopy\.css|print\.css)$")
SAMPLE = ["math/make-10/", "languages/word-detective/", "progress/"]
# A content file two pages share, and the pages that load it.
CONTENT = {"languages/words.js": ["languages/word-match/", "languages/word-trail/"]}
OWN_CONTENT = re.compile(r"^([a-z]+/[a-z0-9-]+/)(words|data)\.js$")

NOT_SUBJECTS = re.compile(r"^([._].*|docs|fonts|tools|src|help|privacy|progress|node_modules|guide-src|plugins|sync|images)$")
# A path a page loads from outside its own folder: "../words.js", "../spelling-quiz/words.js".
LOADS = re.compile(r"""["'`]((?:\.\./)+[A-Za-z0-9_./-]+\.(?:js|json|css))["'`]""")


def site_pages(root=ROOT):
    """Every page at HEAD as a site path: "" (home), help/, privacy/, progress/, then <subject>/<game>/."""
    pages = [p for p in ["", "help/", "privacy/", "progress/"] if (root / p / "index.html").is_file()]
    for subject in sorted(d for d in root.iterdir() if d.is_dir() and not NOT_SUBJECTS.match(d.name)):
        pages += [f"{subject.name}/{g.name}/" for g in sorted(subject.iterdir()) if (g / "index.html").is_file()]
    return pages


def loaders(pages, root=ROOT):
    """{file: [pages]}: the files each page loads from outside its own folder (the shared loopy files too,
    which never get here: they count as everything)."""
    out = {}
    for page in pages:
        html = (root / page / "index.html").read_text(encoding="utf-8", errors="replace")
        for ref in set(LOADS.findall(html)):
            target = posixpath.normpath(posixpath.join(page or ".", ref))
            if not target.startswith(page or "\0"):
                out.setdefault(target, []).append(page)
    return out


def test_pages(root=ROOT):
    """The pages each test covers: {test: [pages]}. The extras read their pages from their own files."""
    pages = site_pages(root)
    games = [p for p in pages if p.count("/") == 2]
    pictures = root / "tools/e2e/pictures.mjs"
    pics = re.search(r"const PAGES = \[([^\]]*)\]", pictures.read_text(encoding="utf-8")) if pictures.is_file() else None
    out = {"a11y": pages, "play": games, "retry": [g for g in games if g != "mix/daily-mix/"],
           "pictures": re.findall(r'"([^"]*)"', pics.group(1)) if pics else pages}
    for name in EXTRAS:
        f = root / f"tools/e2e/{name}.mjs"
        text = f.read_text(encoding="utf-8") if f.is_file() else ""
        named = {m for m in re.findall(r"""["'`]((?:[a-z]+/[a-z0-9-]+/)|help/|privacy/|progress/)["'`]""", text)}
        out[name] = [""] + sorted(p for p in named if p in pages)   # every one of them starts on the home page
    return out


def effect(path, pages, loads):
    """What one changed file needs: {test: ALL | True | set(pages)}, or None for everything."""
    for pattern, eff in RULES:
        m = pattern.match(path)
        if m:
            return eff(m) if callable(eff) else eff
    # The shared files every page loads (src/, loopy.js, loopy.css, fonts, icons, the manifest): everything.
    if SHARED.match(path) or ("/" not in path and path != "index.html"):
        return None
    owner = next((page for rx, page in OWNED.items() if rx.match(path)), None)
    if owner is None:
        # The deepest page folder the file sits in. The home page owns only its own index.html.
        owner = max((p for p in pages if p and path.startswith(p)), key=len, default="" if path == "index.html" else None)
    if owner is not None and owner not in pages:
        return None
    # A file of a page that is gone (its folder has no index.html now) has no owner: everything runs.
    touched = ({owner} if owner is not None else set()) | set(loads.get(path, []))
    if not touched:
        return None
    return {test: set(touched) for test in (*JOBS, *EXTRAS)} | {"lighthouse": True}


def plan(changes, root=ROOT):
    """changes: (status, path) pairs from git diff --name-status. Returns the plan (see the top of the file)."""
    pages = site_pages(root)
    covers = test_pages(root)
    loads = loaders(pages, root)
    want = {}   # test -> ALL, True or a set of pages
    for _, path in changes:
        eff = effect(path, pages, loads)
        if eff is None:
            return everything(guide=guide_rest(changes))
        for test, scope in eff.items():
            have = want.get(test)
            if scope is ALL or have is ALL:
                want[test] = ALL
            elif scope is True or have is True:
                want[test] = True
            else:
                want[test] = (have or set()) | scope
    out = {}
    for test in JOBS:
        scope = want.get(test)
        if scope is ALL:
            out[test] = ALL
        else:
            hit = [p for p in covers[test] if scope and p in scope]
            out[test] = json.dumps(hit) if hit else "none"
    extras = []
    for test in EXTRAS:
        scope = want.get(test)
        if scope is ALL or scope is True or (scope and set(covers[test]) & scope):
            extras.append(test)
    out["extras"] = json.dumps(extras)
    out["lighthouse"] = bool(want.get("lighthouse"))
    out["site"] = out["lighthouse"] or bool(extras) or any(out[t] != "none" for t in JOBS)
    out["guide"] = guide_rest(changes)
    return out


def guide_rest(changes):
    """The guide check: the guide or a tool it uses changed, or a file was added, removed or renamed."""
    return any(GUIDE.match(p) or (s[0] in "ADR" and not DOCS.match(p)) for s, p in changes)


def everything(guide=True):
    return {**{t: ALL for t in JOBS}, "extras": json.dumps(list(EXTRAS)), "lighthouse": True, "site": True, "guide": guide}


def needs(changes):
    """(site, guide): does the change need any browser test, and the guide check."""
    p = plan(changes)
    return p["site"], p["guide"]


def lighthouse_pages(changes, exists=lambda page: (ROOT / page / "index.html").is_file()):
    """The site paths to score. A page counts only when it is there at HEAD (the script runs on the checkout):
    a deleted page is not scored, even when its data.js went with it, and a data file whose page stays still counts."""
    pages = [""]
    for status, path in changes:
        if path.endswith("index.html") and status[0] != "D" and not path.startswith(("guide-src/", "docs/", "help/privacy")):
            page = path[:-len("index.html")]
            if page not in pages:
                pages.append(page)
        own = OWN_CONTENT.match(path)
        for page in CONTENT.get(path, []) + ([own.group(1)] if own else []):
            if page not in pages and exists(page):
                pages.append(page)
    if any(SHARED.match(path) for _, path in changes):
        pages += [p for p in SAMPLE if p not in pages]
    return pages


def diff(base, head):
    out = subprocess.run(["git", "diff", "--name-status", "-M", base, head], capture_output=True, text=True, check=True).stdout
    changes = []
    for line in out.splitlines():
        parts = line.split("\t")
        # A rename names the old path, then the new one. The old path is gone at HEAD (no page to score), so it
        # counts as deleted; the new path keeps the rename status (the guide needs a run for either).
        changes += [("D" if parts[0][0] == "R" and i == 0 and len(parts) > 2 else parts[0], p) for i, p in enumerate(parts[1:])]
    return changes


def show(p):
    for key in (*JOBS, "extras", "lighthouse", "site", "guide"):
        v = p[key]
        print(f"{key}={str(v).lower() if isinstance(v, bool) else v}")


def main(argv):
    if argv == ["--all"]:
        return show(everything())
    args = [a for a in argv if a != "--pages"]
    if len(args) != 2:
        sys.exit(__doc__)
    changes = diff(*args)
    if "--pages" in argv:
        print("\n".join(lighthouse_pages(changes)))
        return
    for status, path in changes:
        print(f"{status}\t{path}", file=sys.stderr)
    show(plan(changes))


if __name__ == "__main__":
    main(sys.argv[1:])
