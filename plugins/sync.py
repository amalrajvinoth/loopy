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
- plugins/loopy/RULES.md -> AGENTS.md at the repo root (the rules plus how to build and check, for every
  coding agent: Codex, Copilot, Cursor, Gemini CLI, ...) and CLAUDE.md, which loads AGENTS.md for Claude Code.
"""
import json, pathlib, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLUGINS = sorted(p.parent.parent for p in (ROOT / "plugins").glob("*/.claude-plugin/plugin.json"))
MARK = "<!-- Copied from {src} by plugins/sync.py. Edit the source there, then run python3 plugins/sync.py. -->\n"
SETTINGS = ROOT / ".claude/settings.json"


def with_mark(text, src):
    """Put the copied-from line right after the frontmatter (the frontmatter must stay first)."""
    if text.startswith("---\n"):
        end = text.index("\n---\n", 4) + 5
        return text[:end] + "\n" + MARK.format(src=src) + text[end:]
    return MARK.format(src=src) + text


AGENTS_HEAD = """<!-- Written by plugins/sync.py from plugins/loopy/RULES.md. Do not edit: add a rule there (the add-rule skill), then run python3 plugins/sync.py. -->
# loopy for coding agents

loopy is a free learning games website for kids in grades 1 to 10, in English and German. It is plain HTML, CSS and JavaScript: one shared script and style sheet, no framework, no outside requests. `DESIGN.md` says how it looks. The README's "For developers" part says how a game is built. The rules below are the project's standing rules. The owner's words in the task win where they differ.

## Build and check

```sh
npm ci --prefix tools/build --ignore-scripts        # once: the minifier (esbuild) and the type checker
python3 tools/build.py                              # after any edit in src/ or to a page: loopy.js, loopy.css, sw.js, page policies
python3 tools/build.py --check                      # what CI runs
node tools/build/node_modules/typescript/bin/tsc -p tools/build   # src/ type-checks against src/loopy.d.ts
python3 tools/csp.py --check && python3 tools/check_external.py && python3 tools/guide_check.py
python3 tools/review.py                             # the loopy rules, saved data, size and docs, against main
python3 plugins/sync.py --check && python3 plugins/loopy/scripts/drift.py
npm ci --prefix tools/a11y --ignore-scripts         # once: the browser tests
node tools/a11y/check.mjs && node tools/e2e/play.mjs && node tools/e2e/retry.mjs   # ENGINE=webkit runs them in Safari's engine
```

Pull requests go against `main`, from a branch, with `.github/pull_request_template.md`. Commit messages are plain words. No tool attribution lines anywhere.

"""

CLAUDE_MD = """<!-- Written by plugins/sync.py. Do not edit: the rules live in plugins/loopy/RULES.md. -->
@AGENTS.md

The line above loads AGENTS.md, the rules every coding agent reads. The skills in `.claude/skills/` know the repo's workflows (ship-pr, heal, new-game, loopy-review, loopy-docs, plan-options, go); the hooks in `.claude/settings.json` stop the common slips.
"""


def agents_md():
    """AGENTS.md: the head above, then RULES.md with its headings one level down."""
    rules = (ROOT / "plugins/loopy/RULES.md").read_text(encoding="utf-8")
    body = []
    for line in rules.splitlines():
        if line.startswith("# "):
            line = "## Rules"
        elif line.startswith("## "):
            line = "#" + line
        body.append(line)
    return AGENTS_HEAD + "\n".join(body).rstrip() + "\n"


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
    if check and problems:
        print("The plugin copies in .claude/ are out of date. Run: python3 plugins/sync.py\n - " + "\n - ".join(problems))
        return 1
    if not check:
        print(f"Updated {len(problems)} file(s) in .claude/." if problems else "The .claude/ copies are up to date.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
