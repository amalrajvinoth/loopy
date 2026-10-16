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


def wanted():
    """{path in .claude/: content} for every copy, and the merged hooks."""
    files, hooks = {}, {}
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
