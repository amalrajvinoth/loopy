#!/usr/bin/env python3
"""Every loopy check, in one place. Runs the ones a change needs and says why a red one matters.

    python3 tools/check.py              the checks this change needs (compared with origin/main)
    python3 tools/check.py --fast       the same, without the browser tests and the guide build
    python3 tools/check.py --all        every check, whatever changed
    python3 tools/check.py --webkit     also the accessibility check and the play test in WebKit (Safari's engine)
    python3 tools/check.py --list       say what would run and why, and run nothing
    python3 tools/check.py play retry   only the checks named
    python3 tools/check.py --base REF   compare with another branch or commit

This is the list the ship-pr and loopy-review skills, AGENTS.md and the README point at, so it is written
once. The GitHub check (.github/workflows/checks.yml) runs the same commands; plugins/loopy/scripts/drift.py
fails when a check is added there and not here. Which browser tests a change needs comes from
tools/ci_changes.py, the same answer CI uses, and so do the pages they test: a change to one game tests that
game (PAGES), a change to a shared file tests every page. --all and a check named by hand test every page. One difference: CI runs every lint whatever changed; here a
lint (types, styles, scripts, workflows, links) runs when a file it reads changed. --all runs them all.

tools/review.py also exits 1 for a `must` that was already on main. That is reported as "already on main"
and does not turn the run red; only a `must` this change added does.

A check whose tool is not on this machine is listed as "not run here" with the line that installs it. It
does not fail the run, because CI runs it; say so in the pull request. The npm packages (tools/build,
tools/lint, tools/a11y, guide-src) are installed from their lock files when missing, like CI does. When
that install fails, the checks that need it are red: they did not run, and nothing else would say so.

When git cannot compare with the base (a branch it does not know), the run stops, because "nothing changed"
would leave checks out.

Lighthouse runs in CI only (job "Lighthouse budgets"); the heal recipe "Lighthouse budgets are red" says
how to run it by hand.
"""
import json, os, pathlib, re, shutil, subprocess, sys, tempfile, time

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
import ci_changes  # noqa: E402  (the same "which long checks" answer CI uses)

PY = sys.executable
A11Y = "tools/a11y/node_modules/playwright-core"
NPM = "npm ci --ignore-scripts --no-audit --no-fund --prefix "
WORKFLOW_TOOLS = "pip install --require-hashes -r tools/lint/requirements.txt"

# What a check needs before it can run: (a path in the repo or a command on PATH, how to get it).
# The npm ones are installed by this script; the rest are named and left to the person.
BUILD = [("tools/build/node_modules/esbuild", NPM + "tools/build")]
LINT = [("tools/lint/node_modules", NPM + "tools/lint")]
BROWSER = [(A11Y, NPM + "tools/a11y")]
GUIDE = BROWSER + [("guide-src/node_modules", NPM + "guide-src")]

ALWAYS, SITE, GUIDE_JOB, ASKED = "always", "site", "guide", "asked"


def paths(pattern):
    """A check that runs when a changed file matches."""
    return re.compile(pattern, re.X)


# name, command, what it proves, when it runs, what it needs, why a red one matters, its heal recipe
CHECKS = [
    ("build", f"{PY} tools/build.py --check", "loopy.js, loopy.css, sw.js and the page policies match src/", ALWAYS, BUILD,
     "Run python3 tools/build.py and commit the result. Never edit the built files.", "Built files out of date"),
    ("types", "node tools/build/node_modules/typescript/bin/tsc -p tools/build", "src/ type-checks against src/loopy.d.ts",
     paths(r"^(src/|tools/build/)"), BUILD,
     "A new Loopy member or a changed signature goes in src/loopy.d.ts too.", "Type check fails"),
    ("styles", "node tools/lint/check.mjs", "the styles: Baseline CSS only, theme colours in pages, nothing broken or doubled",
     paths(r"(\.html$ | \.css$ | ^tools/lint/)"), LINT,
     "Only CSS every browser has had for 30 months. A page writes no colour out: it takes var(--ink) and the rest. "
     "A too-new feature gets a fallback, never an ignore entry.", "Style lint is red"),
    ("scripts", "node tools/lint/scripts.mjs", "every page's script: no undefined or unused name, === not ==, Baseline JavaScript only",
     paths(r"(\.html$ | (words|data)\.js$ | ^tools/lint/)"), LINT,
     "A finding that is right on purpose gets an eslint-disable-next-line comment with its reason, never a rule off for every page.",
     "Script lint is red (ESLint)"),
    ("workflows", "zizmor --offline .github/workflows", "the workflows leak no token and run no untrusted input",
     paths(r"^(\.github/workflows/ | tools/lint/requirements\.txt)"), [("zizmor", WORKFLOW_TOOLS)],
     "A finding that is right on purpose gets `# zizmor: ignore[rule]` with its reason, never a loosened check.",
     "Workflow audit is red (zizmor or actionlint)"),
    ("actionlint", "actionlint", "the workflows' YAML and shell are sound",
     paths(r"^(\.github/workflows/ | tools/lint/requirements\.txt)"), [("actionlint", WORKFLOW_TOOLS)],
     "Fix the YAML or the shell line it names.", "Workflow audit is red (zizmor or actionlint)"),
    ("links", "lychee --config tools/lint/lychee.toml -- './**/*.md' './**/*.html'", "every link inside the repo points at a file that exists",
     paths(r"(\.md$ | \.html$ | ^tools/lint/lychee\.toml)"), [("lychee", "brew install lychee (CI runs it by itself)")],
     "Point the link at the real file. Offline: it opens no connection.", "Link check is red (lychee)"),
    ("policy", f"{PY} tools/csp.py --check", "every page's security policy matches its code", ALWAYS, [],
     "Run python3 tools/build.py. Never hand-edit the policy line.", "Page security policy out of date"),
    ("outside", f"{PY} tools/check_external.py", "nothing loads from another website", ALWAYS, [],
     "Put the file in the repo or remove it. loopy makes no outside requests.", "Something loads from outside"),
    ("guide-pages", f"{PY} tools/guide_check.py", "every game has a guide page, in English and German", ALWAYS, [],
     "Add the missing guide page in both languages.", "Guide page missing for a game"),
    ("review", f"{PY} tools/review.py", "the loopy rules, saved data, sizes and docs, against main", ALWAYS, [],
     "A `must` this change added must be fixed. `docs` rows are docs the change may have missed.", 'review.py "must"'),
    ("budget", f"{PY} tools/review.py --budget", "the size budgets: 100 KB a page, loopy.js and loopy.css grow by at most 2 KB", ALWAYS, [],
     "Make it smaller. When the growth is the point, a line `Size budget: <why>` in the pull request body allows it.",
     "Size budget is red"),
    ("plugins", f"{PY} plugins/sync.py --check", "the .claude/ copies, AGENTS.md and the skill sizes match plugins/", ALWAYS, [],
     "Run python3 plugins/sync.py. A skill over its size limit gets shorter, or moves detail to a page next to it.",
     "Plugin copies out of date"),
    ("drift", f"{PY} plugins/loopy/scripts/drift.py", "the plugin is in step with the repo", ALWAYS, [],
     "Update what it names (the evolve skill), then run drift.py --update.", "Plugin behind the repo"),
    ("hooks", f"{PY} plugins/test_hooks.py", "the plugin hooks do what they say", paths(r"^(plugins/|\.claude/)"), [],
     "Fix the hook. Change the test only when the new behaviour was asked for.", "Hook test fails"),
    ("sync-server", "node sync/test.mjs", "the Family sync server answers right", ALWAYS, [],
     "See sync/README.md.", "Family sync fails"),
    ("sync-usage", "node tools/sync-usage.test.mjs", "the Monday usage report prints counts only", ALWAYS, [],
     "The issue and the log are public: counts only.", "Family sync usage job is red"),
    ("chess", "node tools/chess/build.mjs --check", "every chess puzzle plays through with the game's own rules, and its files are current",
     paths(r"^(brain/chess-puzzles/ | tools/chess/)"), [],
     "A puzzle that no longer plays means the rules in the page changed: fix the rules, never drop the check.", "Chess puzzles check fails"),
    ("ci-changes", f"{PY} tools/ci_changes_test.py", "CI picks the right browser tests and pages for a change",
     paths(r"^(tools/ci_changes(_test)?\.py | tools/e2e/.* | tools/a11y/check\.mjs | \.github/workflows/checks\.yml)$"), [],
     "A wrong pick skips a test a change needs. Fix the rule in tools/ci_changes.py, never the test.",
     "All checks fails, or a long check did not run"),
    ("a11y", "node tools/a11y/check.mjs", "every page works with a keyboard and a screen reader", SITE, BROWSER,
     "Fix the page. Never turn an axe rule off.", "Play test or accessibility check cannot start"),
    ("play", "node tools/e2e/play.mjs", "every game plays: no errors, stars add up, no repeated question (GAME=<id> for one game)", SITE, BROWSER,
     "It also proves a day is only Today's 10, money shows its sign, and loopy's language wins over an old Words in pick.",
     "Play test: question came back too soon"),
    ("pictures", "node tools/e2e/pictures.mjs", "the home page and six games still look the same at the eight sizes", SITE,
     BROWSER,
     'Meant to look different? Put the label "refresh pictures" on the pull request. Never loosen the compare.',
     "Picture test is red"),
    ("retry", "node tools/e2e/retry.mjs", "Try again in every game: a mistake comes back until it is fixed", SITE, BROWSER,
     "Make the game's rebuild accept every question it makes. Never loosen the test.", "Try again test: the missed question does not come first"),
    ("levels", "node tools/e2e/levels.mjs", "levels follow the child: up when ready, kept over the birthday", SITE, BROWSER,
     "A child never loses a level they earned.", "Levels test fails"),
    ("switch", "node tools/e2e/switch.mjs", "switching the child mid-game: each child keeps their own stars, log and last game", SITE, BROWSER,
     "Nothing is saved after a switch starts, until the reload.", "Switch test fails"),
    ("hello", "node tools/e2e/hello.mjs", "the first visit: the welcome sheet once, the family code row until a code is set",
     SITE, BROWSER,
     "A test that starts with an empty browser must set loopy.hello.", "First visit test fails"),
    ("offline", "node tools/e2e/offline.mjs", "after an update the offline copy saves the new pages, never an old one",
     SITE, BROWSER, "See the recipe.", "Offline copy keeps an old page"),
    ("sync", "node tools/e2e/sync.mjs", "Family sync keeps two devices in step and sends nothing when off",
     SITE, BROWSER, "See sync/README.md.", "Family sync fails"),
    ("guide", f"npm run build --prefix guide-src && {PY} tools/csp.py --check && {PY} tools/check_external.py && node guide-src/scripts/check.mjs",
     "the guide builds; its policies, links, search and accessibility are right",
     GUIDE_JOB, GUIDE, "When a game looks different, also run npm run screens --prefix guide-src and commit the pictures.",
     "Guide build or check fails"),
    ("a11y-webkit", "node tools/a11y/check.mjs", "the accessibility check in WebKit, the engine behind Safari", ASKED, BROWSER,
     "Safari does something differently. Fix the page for both engines; never skip the run.", "WebKit accessibility run is red, Chromium's is green"),
    ("play-webkit", "node tools/e2e/play.mjs", "the play test in WebKit", ASKED, BROWSER,
     "Look for layout that leans on dvh, :has(), dialogs, speech or audio.", "A browser test is red in WebKit only"),
]
ENV = {"pictures": {"ENGINE": "pinned"}, "a11y-webkit": {"ENGINE": "webkit"}, "play-webkit": {"ENGINE": "webkit"}}
SLOW = {"a11y", "play", "pictures", "retry", "levels", "switch", "hello", "offline", "sync", "guide", "a11y-webkit", "play-webkit"}


# A browser test says this when its browser is not on the machine; the line after "Run:" installs it.
# Node prints the line of source that threw before the message itself, so the capture stops at a quote or a backslash.
NO_BROWSER = re.compile(r"""(?:is not installed for ENGINE=\w+\. Run: ([^"\\\n]+)|No Chrome or Chromium found\. ([^"\\\n]+))""")


def git(*args):
    p = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
    return p.stdout.strip() if p.returncode == 0 else ""


def changes(base):
    """(status, path) pairs: what differs from where the branch left the base, plus files not committed yet.
    A rename counts under both names, as in tools/ci_changes.py. Raises LookupError with git's own words
    when it cannot compare: an empty list would read as "nothing changed" and leave checks out."""
    start = git("merge-base", base, "HEAD") or base
    p = subprocess.run(["git", "diff", "--name-status", "-M", start], cwd=ROOT, capture_output=True, text=True)
    if p.returncode:
        raise LookupError(p.stderr.strip() or f"git diff {start} failed")
    out = []
    for line in p.stdout.strip().splitlines():
        status, *names = line.split("\t")
        out += [(status, name) for name in names]
    return out + [("A", name) for name in git("ls-files", "--others", "--exclude-standard").splitlines()]


def musts(text):
    """The `must` rows of a tools/review.py table."""
    return {line.strip() for line in text.splitlines() if line.lstrip().startswith("| must |")}


def musts_on_base(base):
    """The `must` rows tools/review.py already prints where the branch left the base: those are not this
    change's doing, so they do not turn its run red. Read in a throwaway checkout of that commit."""
    start = git("merge-base", base, "HEAD") or git("rev-parse", base)
    if not start:
        return set()
    with tempfile.TemporaryDirectory() as tmp:
        there = pathlib.Path(tmp) / "base"
        if subprocess.run(["git", "worktree", "add", "--detach", str(there), start], cwd=ROOT, capture_output=True).returncode:
            return set()
        try:
            p = subprocess.run([PY, "tools/review.py"], cwd=there, capture_output=True, text=True)
            return musts(p.stdout)
        finally:
            subprocess.run(["git", "worktree", "remove", "--force", str(there)], cwd=ROOT, capture_output=True)


# The browser tests that test only the pages a change touches, and the key of tools/ci_changes.py that says which.
SCOPED = {"a11y": "a11y", "play": "play", "pictures": "pictures", "retry": "retry", "a11y-webkit": "a11y", "play-webkit": "play"}


def wanted(check, changed, ci):
    """Does this change need the check, and the reason in words. ci: the plan from tools/ci_changes.py."""
    when, name = check[3], check[0]
    if when == ALWAYS:
        return True, "always"
    if when == SITE and name in SCOPED:
        scope = ci[SCOPED[name]]
        if scope == "none":
            return False, "no page it tests, and no file it reads, changed"
        return True, "a shared file or the test changed: every page" if scope == "all" else "the pages this change touches: " + ", ".join(p or "home" for p in json.loads(scope))
    if when == SITE:
        run = name in json.loads(ci["extras"])
        return run, "a page it opens or a file it reads changed" if run else "no page it opens, and no file it reads, changed"
    if when == GUIDE_JOB:
        guide = ci["guide"]
        return guide, "the guide, or a file added or removed" if guide else "the guide did not change"
    if when == ASKED:
        return False, "only with --webkit or by name"
    hit = next((path for _, path in changed if when.search(path)), None)
    return bool(hit), (hit + " changed") if hit else "none of its files changed"


INSTALLS = {}   # an npm install this run tried -> what it printed when it failed ("" when it worked)


def missing(needs, install):
    """The first thing a check needs that is not there: (the line that gets it, what went wrong).
    npm packages are installed first, once a run. A tool that is simply not on this machine has no
    "what went wrong"; an install that was tried and failed does, and that is a red check."""
    for need, how in needs:
        there = (ROOT / need).exists() if "/" in need else bool(shutil.which(need))
        if not there and install and how.startswith("npm ci"):
            if how not in INSTALLS:
                print(f"  installing: {how}", flush=True)
                p = subprocess.run(how, shell=True, cwd=ROOT, capture_output=True, text=True)
                INSTALLS[how] = "" if p.returncode == 0 else ((p.stdout + p.stderr).strip() or f"exit {p.returncode}")
            if INSTALLS[how]:
                return how, INSTALLS[how]
            there = True
        if not there:
            return how, ""
    return None, ""


def main(argv):
    flags = {a for a in argv if a.startswith("--")}
    names = [a for i, a in enumerate(argv) if not a.startswith("--") and (i == 0 or argv[i - 1] != "--base")]
    unknown = [n for n in names if n not in {c[0] for c in CHECKS}] + sorted(flags - {"--all", "--fast", "--webkit", "--list", "--base", "--help"})
    if unknown or "--help" in flags:
        print(__doc__ + "\nChecks: " + ", ".join(c[0] for c in CHECKS) + ("\n\nUnknown: " + ", ".join(unknown) if unknown else ""))
        return 2 if unknown else 0
    base = argv[argv.index("--base") + 1] if "--base" in argv and argv.index("--base") + 1 < len(argv) else "origin/main"
    try:
        changed = changes(base)
    except LookupError as err:
        print(f"Cannot compare with {base}, so there is no telling which checks this change needs.\n   {str(err).splitlines()[0]}\n"
              "Get the branch first (git fetch origin main), or name another one with --base REF.")
        return 2
    ci = ci_changes.plan(changed)

    plan = []
    for check in CHECKS:
        name = check[0]
        run, why = wanted(check, changed, ci)
        env = dict(ENV.get(name, {}))
        if names:
            run, why = name in names, "named"
        elif "--all" in flags and check[3] != ASKED:
            run, why = True, "--all"
        elif name in SCOPED and ci[SCOPED[name]] not in ("all", "none"):
            env["PAGES"] = ci[SCOPED[name]]
        if "--webkit" in flags and check[3] == ASKED and not names:
            run, why = (ci[SCOPED[name]] != "none" or "--all" in flags), "--webkit"
        if "--fast" in flags and name in SLOW and not names:
            run, why = False, "a browser test or the guide build, left out by --fast"
        plan.append((check, run, why, env))

    if "--list" in flags:
        print(f"{len(changed)} changed file(s) against {base}. site={ci['site']} guide={ci['guide']}\n")
        for (name, cmd, what, *_), run, why, env in plan:
            env = "".join(f"{k}={v!r} " if k == "PAGES" else f"{k}={v} " for k, v in env.items())
            print(f"{'run ' if run else 'skip'}  {name:12} {what}\n      {env}{cmd.replace(PY, 'python3')}   ({why})")
        print("\nCI only: Lighthouse budgets on the pages the change touches.")
        return 0

    failed, absent, passed, already = [], [], [], []
    for (name, cmd, what, _when, needs, hint, recipe), run, _why, env in plan:
        if not run:
            continue
        how, broke = missing(needs, install=True)
        if broke:
            failed.append(name)
            tail = "\n".join(("   " + line) for line in broke.splitlines()[-25:])
            print(f"\nRED {name}: did not run, because what it needs would not install.\n   $ {how}\n{tail}\n"
                  "   Why it matters: the check never ran, so nothing says this change is right.\n"
                  "   Fix the install (often package.json and its lock file disagree: npm install in that folder), then run it again.\n",
                  flush=True)
            continue
        if how:
            absent.append((name, how))
            print(f"-  {name}: not run here. Get it with: {how}", flush=True)
            continue
        began = time.time()
        p = subprocess.run(cmd, shell=True, cwd=ROOT, capture_output=True, text=True, env={**os.environ, **env})
        took = f"{time.time() - began:.0f}s"
        if p.returncode == 0:
            passed.append(name)
            print(f"ok {name} ({took}): {what}", flush=True)
            continue
        if name == "review":
            # review.py also exits 1 for a `must` that was on main before this change. That one is reported, not red.
            old = musts(p.stdout) & musts_on_base(base)
            if old and not musts(p.stdout) - old:
                passed.append(name)
                already.extend(sorted(old))
                print(f"ok {name} ({took}): {what}\n   {len(old)} `must` row(s) were already on main, not from this change:\n   "
                      + "\n   ".join(sorted(old)), flush=True)
                continue
        no_browser = NO_BROWSER.search(p.stdout + p.stderr)
        if no_browser:
            how = (no_browser.group(1) or no_browser.group(2)).strip()
            absent.append((name, how))
            print(f"-  {name}: not run here, its browser is missing. Get it with: {how}", flush=True)
            continue
        failed.append(name)
        tail = "\n".join(("   " + line) for line in (p.stdout + p.stderr).strip().splitlines()[-25:])
        print(f"\nRED {name} ({took}): {what}\n   $ {cmd.replace(PY, 'python3')}\n{tail}\n   Why it matters: {hint}\n"
              f"   Recipe: \"{recipe}\" in plugins/loopy/skills/heal/recipes.md\n", flush=True)

    print(f"\n{len(passed)} passed, {len(failed)} red, {len(absent)} not run here.")
    if absent:
        print("Not run here (CI runs them; say so in the pull request): " + ", ".join(name for name, _ in absent))
    if already:
        print(f"Already on main: {len(already)} `must` from tools/review.py. Say so in the pull request; it is not this change's to fix.")
    if failed:
        print("Red: " + ", ".join(failed) + ". Fix the cause, then run them again: python3 tools/check.py " + " ".join(failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
