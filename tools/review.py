#!/usr/bin/env python3
"""Check that the games follow the same rules. Used by the loopy-review skill.

    python3 tools/review.py                 # compares with origin/main (or main)
    python3 tools/review.py --base <ref>    # compares with another branch or commit

It also compares this change with main for three more things:
    saved data   every key a child already has is still read, or moved to its new name
    size         what each page sends over the network, the shared files and the offline copy
    docs         a change people can see also changes its docs, in both languages, in plain English
                 (rows start with "docs"; warnings only, see the loopy-docs skill)

It prints a table of findings and does not change any file:
    must      breaks a project rule (security, both languages, shared parts)
    should    makes a game different from the others
    suggest   small differences worth a look

It exits with 1 if there is a "must" finding. It is not part of the GitHub check (yet).
"""
import gzip, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
sys.dont_write_bytecode = True
import build  # noqa: E402  (only for the list of files the site serves)

findings = []
sizes = []  # (file, before, after) in bytes sent, for the size table


def add(level, where, what):
    findings.append((level, where, what))


def rel(p):
    return str(p.relative_to(ROOT))


def block(text, start):
    """The text between the { at start and its matching }, skipping strings."""
    depth, i, quote = 0, start, None
    while i < len(text):
        c = text[i]
        if quote:
            if c == "\\":
                i += 1
            elif c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start + 1:i]
        i += 1
    return ""


def strings(text):
    """{lang: {key: value}} from every Loopy.addStrings({ en: {...}, de: {...} }) in text."""
    out = {"en": {}, "de": {}}
    for m in re.finditer(r"Loopy\.addStrings\(\s*\{", text):
        body = block(text, m.end() - 1)
        for lang in out:
            lm = re.search(r"\b" + lang + r"\s*:\s*\{", body)
            if lm:
                inner = block(body, lm.end() - 1)
                for k, v in re.findall(r"(\w+)\s*:\s*\"((?:[^\"\\]|\\.)*)\"", inner):
                    out[lang][k] = v
    return out


def check_strings(path, text):
    s = strings(text)
    for k in sorted(set(s["en"]) - set(s["de"])):
        add("must", rel(path), f"`{k}` has English text but no German")
    for k in sorted(set(s["de"]) - set(s["en"])):
        add("must", rel(path), f"`{k}` has German text but no English")
    for lang, d in s.items():
        for k, v in d.items():
            if re.search(r"\bLoopy\b", v):
                add("must", rel(path), f"`{k}` ({lang}) shows \"Loopy\" with a capital L; use lowercase \"loopy\"")


def check_page(path, text):
    for m in re.finditer(r"<[a-zA-Z][^>]*>", text):
        tag = m.group(0)
        line = text.count("\n", 0, m.start()) + 1
        if re.search(r"\sstyle\s*=", tag):
            add("must", f"{rel(path)}:{line}", "`style=` attribute breaks the security policy; use a class")
        if re.search(r"\son[a-z]+\s*=", tag):
            add("must", f"{rel(path)}:{line}", "`on...=` handler breaks the security policy; use addEventListener")


# ---------- Base: the branch this change is compared with ----------

def git(*args):
    r = subprocess.run(["git", *args], cwd=ROOT, capture_output=True)
    return r.stdout if r.returncode == 0 else None


def find_base(asked):
    """The commit where this branch left main (like git diff origin/main...HEAD), or None."""
    for ref in ([asked] if asked else ["origin/main", "main"]):
        fork = git("merge-base", ref, "HEAD")
        if fork:
            return fork.decode().strip()[:12]
    return None


def base_text(base, path):
    b = git("show", f"{base}:{path}")
    return None if b is None else b.decode("utf-8", "replace")


def code_files(read):
    """{path: text} for src/loopy.js and every page, read with read(path) (now or on the base)."""
    out = {}
    for path in ["src/loopy.js", "src/loopy-report.js", "src/loopy-backup.js", "src/loopy-sheet.js", "src/loopy-levels.js", "src/loopy-install.js"] + [rel(p) for p in sorted(ROOT.glob("**/index.html"))
                                     if not build.SKIP_DIRS & set(p.relative_to(ROOT).parts)]:
        text = read(path)
        if text is not None:
            out[path] = text
    return out


# ---------- Saved data: nothing a child already has may be lost ----------

STORE_CALL = re.compile(r"\bstore\.(?:get|set|remove)\(\s*[\"'`]([^\"'`$]+)")
KEY_NAME = re.compile(r"\bKEY\s*=\s*[\"']([^\"']+)[\"']")
LOOPY_KEY = re.compile(r"[\"'](loopy\.[a-zA-Z][\w.]*)[\"']")
NOT_KEY = (".js", ".css", ".html", ".svg", ".png", ".woff2")


def saved_keys(files):
    """Every localStorage key (or key start, like "pm100.op.a") the code reads or writes."""
    keys = set()
    for path, text in files.items():
        keys.update(STORE_CALL.findall(text))
        keys.update(KEY_NAME.findall(text))
        if path.startswith("src/loopy"):
            keys.update(k for k in LOOPY_KEY.findall(text) if not k.endswith(NOT_KEY))
    return keys


def old_names(text):
    """The names in the OLD regex in src/loopy.js: keys moved to child 1 on a first visit."""
    m = re.search(r"var OLD = /(.+)/;", text or "")
    return set(re.findall(r"[A-Za-z][\w]*", m.group(1).replace("?:", ""))) if m else set()


def check_storage(base, now, before):
    keys_now, keys_before = saved_keys(now), saved_keys(before)
    everything = "\n".join(now.values())
    for k in sorted(keys_before - keys_now):
        if k not in everything:
            add("must", "saved data", f"key `{k}` is saved on devices today but nothing reads it any more. "
                "Read the old key once, move it to the new one, then remove it (like the OLD step in src/loopy.js)")
        else:
            add("suggest", "saved data", f"key `{k}` is only named now, not read with `store.get`. Check it is still "
                "moved or read for children who saved it")
    for k in sorted(keys_now - keys_before):
        add("suggest", "saved data", f"new key `{k}`: validate it on read, keep it small, use `Loopy.store` if it "
            "belongs to one child, and add it to the stars code (`Loopy.backup`) if it holds progress")
    gone = old_names(before.get("src/loopy.js")) - old_names(now.get("src/loopy.js"))
    for name in sorted(gone):
        add("must", "src/loopy.js", f"`{name}` was taken out of OLD, so devices that still have old `{name}` keys "
            "lose them on their first visit")
    for path, text in now.items():
        if not path.startswith("src/loopy") and "localStorage" in text:
            add("must", path, "uses `localStorage` directly; use `Loopy.store` so each child keeps their own data")
        was = before.get(path, "")
        for name, pattern, why, where in [
            ("removes saved data", r"\.removeItem\(|localStorage\.clear\(|\.deleteDatabase\(",
             "Check it only removes what the person asked to remove, and that old data is moved first, not dropped", None),
            ("writes to localStorage", r"localStorage\.setItem\(", "Check per-child data goes through `Loopy.store`, and device-wide keys "
             "are in the stars code's DEVICE list", "src/loopy.js"),
            ("uses IndexedDB", r"\bindexedDB\b", "Check what is in localStorage now is moved over once, and the page still works "
             "when IndexedDB is blocked (private windows)", None)]:
            n = len(re.findall(pattern, text)) - len(re.findall(pattern, was))
            if n > 0 and (where is None or path.startswith("src/loopy")):
                add("should", path, f"{name} in {n} more place{'s' if n > 1 else ''}. {why}")
    # The stars code lives in src/loopy-backup.js (before 17 Oct 2026 it was in src/loopy.js).
    js_now = now.get("src/loopy.js", "") + now.get("src/loopy-backup.js", "")
    js_before = before.get("src/loopy.js", "") + before.get("src/loopy-backup.js", "")
    for name in ["Loopy.backup", "MAX_CODE", "clean("]:
        if js_now.count(name) != js_before.count(name):
            add("suggest", "src/loopy.js", f"`{name}` changed: check an old stars code still loads, and a new "
                "code still loads on a device that has the old version")
            break


# ---------- Size: what a visitor downloads ----------

FONTS_ON_PAGE = ["fonts/lexend-latin.woff2", "fonts/fredoka-latin.woff2"]
PAGE_BUDGET = 100 * 1024     # a page with loopy.js, loopy.css and its two fonts, as sent over the network
SHARED_GROWTH = 1024         # every page pays for loopy.js and loopy.css
PAGE_GROWTH = 2048
OFFLINE_GROWTH = 50 * 1024   # the offline copy every visitor's browser keeps
BIG_FILE = 50 * 1024


def sent(data, path):
    """Bytes sent over the network: GitHub Pages compresses text, not fonts or pictures."""
    if data is None:
        return None
    return len(data) if path.endswith((".woff2", ".png")) else len(gzip.compress(data, 9))


def served(base):
    """{path: bytes} for every file the site serves, now and on the base."""
    now = {rel(p): p.read_bytes() for p in build.offline_files().values()}
    before = {}
    if base:
        for path in (git("ls-tree", "-r", "--name-only", base) or b"").decode().splitlines():
            parts = set(pathlib.PurePosixPath(path).parts)
            if pathlib.PurePosixPath(path).suffix in build.SAVE and not build.SKIP_DIRS & parts and path != "sw.js":
                before[path] = git("show", f"{base}:{path}")
    return now, before


def check_size(base):
    now, before = served(base)
    shared = lambda files: sum(sent(files.get(f), f) or 0 for f in ["loopy.js", "loopy.css"] + FONTS_ON_PAGE)
    for path in sorted(set(now) | set(before)):
        a, b = sent(now.get(path), path), sent(before.get(path), path)
        if a != b and base:
            sizes.append((path, b, a))
        grew = (a or 0) - (b or 0)
        if path in ("loopy.js", "loopy.css") and grew > SHARED_GROWTH:
            add("should", path, f"grew by {grew / 1024:.1f} KB sent; every page pays for this. Move code only one "
                "page uses into that page, or make it smaller")
        elif path.endswith(".html") and grew > PAGE_GROWTH:
            add("suggest", path, f"grew by {grew / 1024:.1f} KB sent. Look for repeated data or code to share")
        elif path.endswith((".woff2", ".png", ".svg")) and (b is None and before and a > BIG_FILE or grew > BIG_FILE):
            add("should", path, f"{a / 1024:.0f} KB file is new or much bigger, and goes into every offline copy")
        if path.startswith("fonts/") and b is None and before:
            add("should", path, "a new font file; the design allows only Fredoka, Lexend and Atkinson")
        if path.endswith(".html"):
            total = (a or 0) + shared(now)
            was = (b or 0) + shared(before) if b is not None else None
            if total > PAGE_BUDGET and (was is None or was <= PAGE_BUDGET or total > was):
                add("should", path, f"page is {total / 1024:.0f} KB sent with loopy.js, loopy.css and fonts "
                    f"(budget {PAGE_BUDGET // 1024} KB)")
    if before:
        grew = sum(map(len, now.values())) - sum(map(len, before.values()))
        if grew > OFFLINE_GROWTH:
            add("should", "sw.js", f"the offline copy grew by {grew / 1024:.0f} KB; every visitor's browser keeps it")


# ---------- Docs: what people see is described, in both languages, in plain words ----------

GUIDE = "guide-src/src/content/docs/"
# Files people see or use. Tools, tests, CI and the plugins are not in it.
SEEN = re.compile(r"^(index\.html|[a-z-]+/index\.html|[a-z-]+/[a-z0-9-]+/index\.html|src/[^/]+\.(js|css)|manifest\.webmanifest|[^/]+\.svg)$")
HARD = {"utilise": "use", "utilize": "use", "prior to": "before", "commence": "start", "initiate": "start",
        "facilitate": "help", "approximately": "about", "subsequently": "then", "in order to": "to",
        "functionality": "what it does", "e.g.": "for example", "i.e.": "that is", "via": "through",
        "localstorage": "saved in this browser", "service worker": "the offline copy", "toggle": "switch or button",
        "modal": "box", "persisted": "saved", "configure": "set"}
LONG = 25  # words in one sentence
# Docs people read: root docs, game READMEs, the guide and the Help page. Not the plugins or tools.
DOCS = re.compile(r"^([A-Z]+\.md|[a-z-]+/[a-z0-9-]+/README\.md|mix/[a-z0-9-]+/README\.md|help/index\.html|guide-src/src/content/docs/.+\.mdx?)$")


def changed_files(base):
    """{path: status} for files changed since base, with uncommitted and new files."""
    out = {}
    for line in (git("diff", "--name-status", base) or b"").decode().splitlines():
        parts = line.split("\t")
        out[parts[-1]] = parts[0][0]
    for path in (git("ls-files", "--others", "--exclude-standard") or b"").decode().splitlines():
        out[path] = "A"
    return out


def added_lines(base, path):
    if not (ROOT / path).exists():
        return []
    d = git("diff", "-U0", base, "--", path)
    if not d:
        return (ROOT / path).read_text(encoding="utf-8", errors="replace").splitlines()
    return [l[1:] for l in d.decode("utf-8", "replace").splitlines() if l.startswith("+") and not l.startswith("+++")]


def plain_text(lines):
    """The prose in some markdown lines: no code blocks, front matter, imports or components."""
    out, code = [], False
    for l in lines:
        s = l.strip()
        if s.startswith("```"):
            code = not code
            continue
        if code or not s or s == "---" or s.startswith(("import ", "<", "title:", "description:", "sidebar:", "order:")):
            continue
        if re.fullmatch(r"[|\s:-]+", s):
            continue
        s = re.sub(r"`[^`]*`", "x", s)                # code words count as one word
        s = re.sub(r"\]\([^)]*\)", "]", s)            # keep link text, drop the address
        out.extend(c for c in s.split("|") if c.strip())
    return out


def check_docs(base):
    files = changed_files(base)
    if not files:
        return
    seen = [p for p in files if SEEN.match(p) and not p.startswith(("tools/", "guide-src/"))]
    docs = [p for p in files if DOCS.match(p)]
    if seen and not docs:
        add("should", "docs", f"{len(seen)} file{'s' if len(seen) > 1 else ''} people see changed ({', '.join(sorted(seen)[:3])}"
            f"{'...' if len(seen) > 3 else ''}) but no docs did. Update the docs that describe it (loopy-docs skill), "
            "or say \"Docs: nothing people see changed\" in the PR")
    for p in seen:
        game = re.match(r"^([a-z]+/[a-z0-9-]+)/index\.html$", p)
        if game and (ROOT / game.group(1) / "README.md").exists() and f"{game.group(1)}/README.md" not in files:
            add("suggest", "docs", f"`{p}` changed but not its README. Does How to play, Age levels or Settings still match?")
    if seen and "RELEASES.md" not in files:
        add("suggest", "docs", "no RELEASES.md row. If people will notice this change, add one at the top")
    # Each guide page has a German twin with the same name.
    for p, st in files.items():
        if not p.startswith(GUIDE) or not p.endswith((".md", ".mdx")) or st == "D":
            continue
        tail = p[len(GUIDE):]
        twin = GUIDE + (tail[3:] if tail.startswith("de/") else "de/" + tail)
        if twin not in files and twin != p:
            add("should", "docs", f"`{p}` changed but not `{twin}`. Change the guide in English and German")
    # The FAQ is in FAQ.md, the Help page and the guide.
    faq = ["FAQ.md", "help/index.html", GUIDE + "help/faq.md", GUIDE + "de/help/faq.md"]
    if any(f in files for f in faq):
        missing = [f for f in faq if f not in files]
        if missing:
            add("should", "docs", f"the FAQ changed in {', '.join(f for f in faq if f in files)} but not in "
                f"{', '.join(missing)}. Keep all of them the same, in both languages (or say why not)")
    if "RELEASES.md" in files and GUIDE + "help/whats-new.md" not in files:
        add("should", "docs", "a RELEASES.md row but no news in the guide's What's new page (help/whats-new.md, EN + DE)")
    # Plain English in what this change wrote (English only).
    for p in sorted(docs):
        if "/de/" in p or files[p] == "D" or not p.endswith((".md", ".mdx")):
            continue
        text = plain_text(added_lines(base, p))
        sentences = [s for chunk in text for s in re.split(r"(?<=[.!?])[\"')*]*\s+", chunk)]
        long = [s for s in sentences if len(s.split()) > LONG]
        if long:
            first = " ".join(long[0].split()[:12])
            add("suggest", p, f"{len(long)} new sentence{'s' if len(long) > 1 else ''} over {LONG} words, like "
                f"\"{first}...\". Split into short sentences")
        low = " ".join(text).lower()
        hard = [w for w in HARD if re.search(rf"(?<![a-z]){re.escape(w)}(?![a-z])", low)]
        if hard:
            add("suggest", p, "hard words: " + ", ".join(f"\"{w}\" (say \"{HARD[w]}\")" for w in hard))


GAME_PARTS = [
    ('class="home-link"', "back button (`.home-link`)"),
    ('id="star-chip"', "star counter (`#star-chip`)"),
    ('id="last5"', "Last 5 dots (`#last5`)"),
    ('id="settings-toggle"', "Settings button (`#settings-toggle`)"),
    ('id="age-picker"', "age picker"),
    ('id="theme-picker"', "theme picker"),
    ('id="sound-toggle"', "sound button"),
    ('id="lang-picker"', "language picker"),
    ('id="reset"', "Reset score button"),
    ("Loopy.getAge()", "difficulty from the age (`Loopy.getAge()`)"),
    ("loopy:age", "reacts to an age change (`loopy:age`)"),
    ("Loopy.rewards.correct", "stars for right answers (`Loopy.rewards.correct`)"),
    ("Loopy.rewards.wrong", "logs wrong answers (`Loopy.rewards.wrong`)"),
    ("Loopy.recent.clear", "Reset score clears Last 5 (`Loopy.recent.clear`)"),
    ("Loopy.worksheet", "Print worksheet (`Loopy.worksheet`)"),
]
README_PARTS = ["How to play", "Age levels", "Settings", "Print a worksheet", "Example help text"]


def main():
    asked = sys.argv[sys.argv.index("--base") + 1] if "--base" in sys.argv[:-1] else None
    base = find_base(asked)
    if base is None:
        print(f"Note: no `{asked or 'origin/main'}` to compare with, so saved data and size were not compared.\n")
    now = code_files(lambda path: (ROOT / path).read_text(encoding="utf-8") if (ROOT / path).exists() else None)
    if base:
        check_storage(base, now, code_files(lambda path: base_text(base, path)))
    check_size(base)
    if base:
        check_docs(base)

    home = (ROOT / "index.html").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    games = re.findall(r"path:\s*\"([^\"]+)\"", home[home.find("const GAMES"):home.find("];", home.find("const GAMES"))])

    for p in sorted(ROOT.glob("*/*/index.html")) + sorted(ROOT.glob("*/index.html")) + [ROOT / "index.html"]:
        text = p.read_text(encoding="utf-8")
        check_page(p, text)
        check_strings(p, text)
    check_strings(ROOT / "src/loopy.js", (ROOT / "src/loopy.js").read_text(encoding="utf-8"))

    for g in games:
        page = ROOT / g / "index.html"
        if not page.exists():
            add("must", "index.html", f"GAMES lists `{g}` but there is no {g}index.html")
            continue
        text = page.read_text(encoding="utf-8")
        for needle, name in GAME_PARTS:
            if needle not in text:
                add("should", rel(page), f"missing the {name}, which the other games have")
        gid = re.search(r'id="last5"\s+data-game="([^"]+)"', text)
        if gid and f'"{gid.group(1)}"' not in (ROOT / "src/loopy.js").read_text(encoding="utf-8"):
            add("must", rel(page), f"game id `{gid.group(1)}` is not in the GAMES lists in src/loopy.js")
        if f"]({g})" not in readme:
            add("should", "README.md", f"no row in \"The games\" table for `{g}`")
        rd = ROOT / g / "README.md"
        if not rd.exists():
            add("must", g, "no README.md")
            continue
        heads = re.findall(r"^## (.+)$", rd.read_text(encoding="utf-8"), re.M)
        for h in README_PARTS:
            if h not in heads:
                add("should", rel(rd), f"no \"## {h}\" section")

    order = {"must": 0, "should": 1, "suggest": 2}
    findings.sort(key=lambda f: (order[f[0]], f[1]))
    if sizes:
        print(f"Size sent over the network, compared with `{base}`:\n")
        print("| File | Before | After | Change |")
        print("| --- | --- | --- | --- |")
        kb = lambda n: "new" if n is None else f"{n / 1024:.1f} KB"
        for path, b, a in sizes:
            change = "removed" if a is None else f"{((a or 0) - (b or 0)) / 1024:+.1f} KB"
            print(f"| `{path}` | {kb(b)} | {'gone' if a is None else kb(a)} | {change} |")
        print()
    if not findings:
        print("No findings. All games follow the same rules, saved data is kept, sizes are in budget, and the docs keep up.")
        return 0
    print("| Level | Where | Finding |")
    print("| --- | --- | --- |")
    for level, where, what in findings:
        print(f"| {level} | `{where}` | {what} |")
    return 1 if any(f[0] == "must" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
