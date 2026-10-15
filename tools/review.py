#!/usr/bin/env python3
"""Check that the games follow the same rules. Used by the loopy-review skill.

    python3 tools/review.py

It prints a table of findings and does not change any file:
    must      breaks a project rule (security, both languages, shared parts)
    should    makes a game different from the others
    suggest   small differences worth a look

It exits with 1 if there is a "must" finding. It is not part of the GitHub check (yet).
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
findings = []


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
README_PARTS = ["How to play", "Settings", "Print a worksheet"]
README_LEVELS = ["How hard it is", "Age levels"]
README_HELP = ["Example help text", "The reason after each answer"]


def main():
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    games = re.findall(r"path:\s*\"([^\"]+)\"", home[home.find("const GAMES"):home.find("];", home.find("const GAMES"))])
    level_names, help_names = {}, {}

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
        level_names[g] = next((h for h in heads if h in README_LEVELS), None)
        help_names[g] = next((h for h in heads if h in README_HELP), None)

    for label, names, choices in (("age levels", level_names, README_LEVELS), ("help text", help_names, README_HELP)):
        for g, h in names.items():
            if h is None:
                add("should", f"{g}README.md", f"no section about {label} (\"{choices[0]}\" or \"{choices[1]}\")")
        used = {h for h in names.values() if h}
        if len(used) > 1:
            add("suggest", "*/README.md", f"game READMEs name the {label} section differently: "
                + ", ".join(f"\"{h}\" ({', '.join(g for g, x in names.items() if x == h)})" for h in sorted(used)))

    order = {"must": 0, "should": 1, "suggest": 2}
    findings.sort(key=lambda f: (order[f[0]], f[1]))
    if not findings:
        print("No findings. All games follow the same rules.")
        return 0
    print("| Level | Where | Finding |")
    print("| --- | --- | --- |")
    for level, where, what in findings:
        print(f"| {level} | `{where}` | {what} |")
    return 1 if any(f[0] == "must" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
