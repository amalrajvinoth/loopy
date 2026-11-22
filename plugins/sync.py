#!/usr/bin/env python3
"""Copy the plugins into the repo's own .claude/ folder, so every session in the loopy repo has them.

    python3 plugins/sync.py           write the copies
    python3 plugins/sync.py --check   exit 1 if the copies are out of date (CI and the Stop hook)

Why copies: Claude Code on the web (the project's cloud threads) does not install plugins from a
repo's settings, but it does load the repo's .claude/skills, .claude/agents and the hooks in
.claude/settings.json. So plugins/ is the source (installable anywhere with /plugin), and this
makes the .claude/ copies. Edit plugins/, never the copies; like src/ and the built loopy.js.

- plugins/<p>/skills/<name>/  -> .claude/skills/<name>/   (with a "copied from" line)
- plugins/<p>/agents/<name>.md -> .claude/agents/<name>.md
- plugins/<p>/hooks/hooks.json -> "hooks" in .claude/settings.json, with ${CLAUDE_PLUGIN_ROOT}
  pointing at "$CLAUDE_PROJECT_DIR"/plugins/<p>. Other settings in that file are kept.
- plugins/loopy/RULES.md and plugins/work-style/RULES.md -> AGENTS.md at the repo root (the rules plus how to
  build and check, for every coding agent: Codex, Copilot, Cursor, Gemini CLI, ...) and CLAUDE.md, which loads
  AGENTS.md for Claude Code.

--check also keeps the skills short (see MAX_SKILL below): every SKILL.md in .claude/skills, the repo's own
included, its description, and AGENTS.md.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLUGINS = sorted(p.parent.parent for p in (ROOT / "plugins").glob("*/.claude-plugin/plugin.json"))
MARK = "<!-- Copied from {src} by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->\n"
SETTINGS = ROOT / ".claude/settings.json"
# The heading the work-style rules get in AGENTS.md. plugins/work-style/hooks/rules.py looks for it.
WORK_STYLE = "How the owner works"
# Sizes, in bytes of the file Claude reads (the .claude/ copy). A skill's body is read whole each time it is used, AGENTS.md in every
# session, and every description in every session. More than this and the text is doing a page's job:
# move the detail into a file next to the skill, which is read only when it is needed.
MAX_SKILL, MAX_AGENTS, MAX_DESCRIPTION = 6 * 1024, 10 * 1024, 200
# A skill that may be longer, with the reason. Keep this list short.
LONGER = {
    "improve-ui": (10 * 1024, "copied from ibelick/ui-skills (MIT); kept word for word so an update is a plain copy"),
}


def with_mark(text, src):
    """Put the copied-from line right after the frontmatter (the frontmatter must stay first)."""
    if text.startswith("---\n"):
        end = text.index("\n---\n", 4) + 5
        return text[:end] + "\n" + MARK.format(src=src) + text[end:]
    return MARK.format(src=src) + text


AGENTS_HEAD = """<!-- Written by plugins/sync.py from plugins/loopy/RULES.md and plugins/work-style/RULES.md. Do not edit: add a rule there (the add-rule skill), then run python3 plugins/sync.py. -->
# loopy for coding agents

loopy is a free learning games website for kids in grades 1 to 10, in English and German. It is plain HTML, CSS and JavaScript: one shared script and style sheet, no framework, no outside requests. `DESIGN.md` says how it looks. The README's "For developers" part says how a game is built. The rules below are the project's standing rules. The owner's words in the task win where they differ.

## Build and check

```sh
python3 tools/build.py    # after any edit in src/ or to a page (once: npm ci --prefix tools/build --ignore-scripts)
python3 tools/check.py    # the checks this change needs, with why a red one matters; --list shows all, --fast skips the browser tests and the guide build
```

Pull requests go against `main`, from a branch.

"""

CLAUDE_MD = """<!-- Written by plugins/sync.py. Do not edit: the rules live in plugins/loopy/RULES.md. -->
@AGENTS.md

The line above loads AGENTS.md, the rules every coding agent reads. The skills in `.claude/skills/` know the repo's workflows (ship-pr, heal, new-game, loopy-review, loopy-docs, plan-options, go); the hooks in `.claude/settings.json` stop the common slips.
"""


def down(text, top):
    """A RULES.md with its headings one level down and its title replaced, so it sits under AGENTS.md's own title."""
    body = []
    for line in text.splitlines():
        if line.startswith("# "):
            line = "## " + top
        elif line.startswith("## "):
            line = "#" + line
        body.append(line)
    return "\n".join(body).rstrip() + "\n"


def agents_md():
    """AGENTS.md: the head above, the loopy rules, then how the owner works (the work-style rules).
    The work-style SessionStart hook sees its rules here and does not print them a second time."""
    rules = down((ROOT / "plugins/loopy/RULES.md").read_text(encoding="utf-8"), "Rules")
    style = ROOT / "plugins/work-style/RULES.md"
    if style.is_file():
        # Its first paragraph is about how the plugin loads; AGENTS.md has its own.
        text = style.read_text(encoding="utf-8")
        head, _, rest = text.partition("\n## ")
        rules += "\n" + down(head.splitlines()[0] + "\n\n## " + rest, WORK_STYLE)
    return AGENTS_HEAD + rules


def wanted():
    """{path: content} for every copy (in .claude/, plus AGENTS.md and CLAUDE.md at the root), and the merged hooks."""
    files, hooks = {"AGENTS.md": agents_md(), "CLAUDE.md": CLAUDE_MD}, {}
    for plugin in PLUGINS:
        rel = plugin.relative_to(ROOT)
        for skill in sorted((plugin / "skills").glob("*/SKILL.md")):
            d = skill.parent
            for f in sorted(d.rglob("*")):
                if f.is_file():
                    text = f.read_text(encoding="utf-8")
                    src = f"{rel}/skills/{d.name}/"
                    files[f".claude/skills/{d.name}/{f.relative_to(d)}"] = with_mark(text, src) if f.name == "SKILL.md" else text
        for agent in sorted((plugin / "agents").glob("*.md")):
            files[f".claude/agents/{agent.name}"] = with_mark(agent.read_text(encoding="utf-8"), f"{rel}/agents/{agent.name}")
        hj = plugin / "hooks/hooks.json"
        if hj.is_file():
            for name, groups in json.loads(hj.read_text(encoding="utf-8")).get("hooks", {}).items():
                for group in groups:
                    for h in group.get("hooks", []):
                        if "command" in h:
                            h["command"] = h["command"].replace("${CLAUDE_PLUGIN_ROOT}", f"$CLAUDE_PROJECT_DIR/{rel}")
                hooks.setdefault(name, []).extend(groups)
    return files, hooks


def copies_on_disk():
    """Files in .claude/ that an earlier sync wrote (their skill folder or agent has the mark)."""
    out = set()
    for skill in (ROOT / ".claude/skills").glob("*/SKILL.md"):
        if "by plugins/sync.py" in skill.read_text(encoding="utf-8"):
            out |= {str(f.relative_to(ROOT)) for f in skill.parent.rglob("*") if f.is_file()}
    for agent in (ROOT / ".claude/agents").glob("*.md"):
        if "by plugins/sync.py" in agent.read_text(encoding="utf-8"):
            out.add(str(agent.relative_to(ROOT)))
    return out


def too_long(files):
    """Skills, descriptions and AGENTS.md past their size. files: what sync writes; the repo's own skills are read from disk."""
    out = []
    skills = {path: text for path, text in files.items() if path.endswith("/SKILL.md")}
    for own in sorted((ROOT / ".claude/skills").glob("*/SKILL.md")):
        rel = str(own.relative_to(ROOT))
        if rel not in skills:
            skills[rel] = own.read_text(encoding="utf-8")
    for path, text in sorted(skills.items()):
        name = path.split("/")[-2]
        limit, why = LONGER.get(name, (MAX_SKILL, ""))
        size = len(text.encode("utf-8"))
        if size > limit:
            out.append(f"{path} is {size} bytes (limit {limit}{', ' + why if why else ''}). Shorten it, or move detail that is "
                       "needed only sometimes into a page next to it and say when to read that page.")
        front = re.match(r"---\n(.*?)\n---\n", text, re.S)
        m = re.search(r"^description:[ \t]*(.*)$", front.group(1) if front else "", re.M)
        said = m.group(1).strip() if m else ""
        quoted = len(said) > 1 and said[0] in "'\"" and said[-1] == said[0]
        if not said or said[0] in ">|":
            out.append(f"{path}: the description must be one line after 'description:' in the frontmatter at the top, "
                       "not a folded or block value: that is the line this check can count.")
            continue
        if not quoted and re.search(r" #|: ", said):
            out.append(f"{path}: the description has ' #' or ': ' in it. In the frontmatter ' #' starts a comment, so everything after "
                       "it is lost (\"Build #N\" became \"Build\"), and ': ' is not allowed. Say it another way.")
        length = len(said) - (2 if quoted else 0)
        if length > MAX_DESCRIPTION:
            out.append(f"{path}: the description is {length} characters (limit {MAX_DESCRIPTION}). Every session reads it: "
                       "say what the skill does and the words that start it, nothing more.")
    agents = len(files["AGENTS.md"].encode("utf-8"))
    if agents > MAX_AGENTS:
        out.append(f"AGENTS.md is {agents} bytes (limit {MAX_AGENTS}). Every session reads it: keep rules to one or two lines "
                   "in the RULES.md files, and put the how-to in the skill, recipe or check that uses it.")
    return out


def main():
    check = "--check" in sys.argv
    files, hooks = wanted()
    problems = []
    for path in files:
        if path.endswith("SKILL.md") or path.startswith(".claude/agents/"):
            target = ROOT / path
            if target.is_file() and "by plugins/sync.py" not in target.read_text(encoding="utf-8"):
                sys.exit(f"{path} is the repo's own, not a plugin copy. Give the plugin skill or agent another name.")
    stale = copies_on_disk() - set(files)
    settings = json.loads(SETTINGS.read_text(encoding="utf-8")) if SETTINGS.is_file() else {}
    new_settings = {**settings, "hooks": hooks}
    for path, text in files.items():
        target = ROOT / path
        if not target.is_file() or target.read_text(encoding="utf-8") != text:
            problems.append(path)
            if not check:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(text, encoding="utf-8")
    for path in sorted(stale):
        problems.append(path + " (removed)")
        if not check:
            (ROOT / path).unlink()
            parent = (ROOT / path).parent
            if parent != ROOT / ".claude/skills" and not any(parent.iterdir()):
                parent.rmdir()
    if settings != new_settings:
        problems.append(".claude/settings.json (hooks)")
        if not check:
            SETTINGS.parent.mkdir(parents=True, exist_ok=True)
            SETTINGS.write_text(json.dumps(new_settings, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    long = too_long(files)
    if long:
        print("Too long (the skills stay short so every session and pull request reads less):\n - " + "\n - ".join(long))
    if check and problems:
        print("The plugin copies in .claude/ are out of date. Run: python3 plugins/sync.py\n - " + "\n - ".join(problems))
        return 1
    if not check:
        print(f"Updated {len(problems)} file(s) in .claude/." if problems else "The .claude/ copies are up to date.")
    return 1 if long else 0


if __name__ == "__main__":
    sys.exit(main())
