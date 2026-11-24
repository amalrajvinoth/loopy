#!/usr/bin/env python3
"""PreToolUse on Bash and the GitHub tools: stop the steps that only the owner may take.

main is live (GitHub Pages deploys it), and a merged sync/ change deploys the Family sync Worker and runs its
table files on the live databases. So these wait for the owner's yes, never Claude's own judgement:
  - deploying: wrangler deploy / publish / pages deploy / versions deploy / rollback / delete
  - the live databases and other live resources: any wrangler command with --remote, wrangler d1 create / delete
  - secrets: wrangler secret, gh secret, gh variable
  - main: git push to main, --all or --mirror, a force push (--force-with-lease on a work branch stays allowed)
  - merging: gh pr merge, the REST merge and auto-merge calls, the GitHub tool merge_pull_request
  - repo settings: gh repo edit / delete / rename / archive, gh ruleset, gh api writes to the repo itself, its
    rulesets, branch protection, Pages, collaborators, hooks, secrets, variables, Actions permissions, environments

Local work stays free: wrangler dev, wrangler d1 execute --local, pushes to a work branch, draft pull requests.
The owner can let one session through by starting Claude Code with LOOPY_OWNER_APPROVED=1 in their own shell;
a command cannot set it for itself.
"""
import os, re, shlex, subprocess, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import repo, duplicate, event

ASK = ("This is the owner's step. Ask them once: the target, the exact command, what it will do and how to undo it. "
       "They run it, or start Claude Code with LOOPY_OWNER_APPROVED=1 for that session.")
SETTINGS = re.compile(r"^/?repos/[^/\s]+/[^/\s]+(/(rulesets(/\S*)?|branches/\S+/protection(/\S*)?|pages(/\S*)?|"
                      r"collaborators(/\S*)?|hooks(/\S*)?|keys(/\S*)?|environments(/\S*)?|topics|"
                      r"actions/(secrets|variables|permissions)(/\S*)?|vulnerability-alerts|automated-security-fixes|"
                      r"private-vulnerability-reporting|secret-scanning(/\S*)?|code-scanning/default-setup))?/?$")
MERGE = re.compile(r"/pulls/\d+/(merge|ccr/auto_merge)/?$")
OPS = set(";&|()\n")
WRAP = {"sudo", "exec", "env", "command", "time", "npx", "bunx", "yarn"}


def segments(cmd):
    """The commands in a shell line, split on ; && || | ( ) and new lines outside quotes, without heredoc bodies
    (text written to a file is not a command). Leading VAR=value, sudo, env, npx -y, npm exec and the like are dropped."""
    cmd = re.sub(r"<<-?\s*(['\"]?)(\w+)\1[^\n]*\n.*?\n\s*\2\s*(\n|$)", "\n", cmd, flags=re.S)
    lex = shlex.shlex(cmd, posix=True, punctuation_chars=";&|()\n")
    lex.whitespace, lex.whitespace_split = " \t\r", True
    try:
        tokens = list(lex)
    except ValueError:
        tokens = cmd.split()
    words = []
    for tok in tokens + [";"]:
        if tok and set(tok) <= OPS:
            while words and (re.fullmatch(r"\w+=.*", words[0]) or words[0] in WRAP or words[0] in ("-y", "--yes", "--")
                             or words[:2] in (["npm", "exec"], ["pnpm", "exec"]) or words[0] == "pnpm"):
                words = words[2:] if words[:2] in (["npm", "exec"], ["pnpm", "exec"]) else words[1:]
            if words:
                words[0] = words[0].rsplit("/", 1)[-1]
                yield words
            words = []
        else:
            words.append(tok)


def branch():
    try:
        return subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True, timeout=5).stdout.strip()
    except (OSError, subprocess.TimeoutExpired):
        return ""


def wrangler(args):
    if "--remote" in args or any(a.startswith("--remote=") for a in args):
        return "a wrangler command with --remote (live Cloudflare data)"
    first = args[0] if args else ""
    if first in ("deploy", "publish", "rollback", "delete") or args[:2] in (["pages", "deploy"], ["versions", "deploy"]):
        return f"wrangler {' '.join(args[:2]) if first in ('pages', 'versions') else first} (a live deploy)"
    if first == "secret":
        return "wrangler secret (a secret)"
    if first == "d1" and len(args) > 1 and args[1] in ("create", "delete"):
        return f"wrangler d1 {args[1]} (a live database)"
    return None


def git_push(args):
    if not args or args[0] != "push":
        return None
    flags = [a for a in args[1:] if a.startswith("-")]
    refs = [a for a in args[1:] if not a.startswith("-")]
    if any(f in ("--force", "-f") or re.fullmatch(r"-[a-zA-Z]*f[a-zA-Z]*", f) for f in flags) or any(r.startswith("+") for r in refs[1:]):
        return "a force push"
    if "--all" in flags or "--mirror" in flags:
        return "git push --all or --mirror (it pushes main too)"
    targets = [r.split(":")[-1] for r in refs[1:]]
    if any(t in ("main", "master", "refs/heads/main", "refs/heads/master") for t in targets):
        return "a push to main (main is live)"
    if len(refs) <= 1 and branch() in ("main", "master"):
        return "a push from the main branch (main is live)"
    return None


def gh(args):
    if args[:2] == ["pr", "merge"]:
        return "gh pr merge (the owner merges)"
    if args[:1] in (["secret"], ["variable"], ["ruleset"]):
        return f"gh {args[0]} (a secret or repo setting)"
    if args[:1] == ["repo"] and len(args) > 1 and args[1] in ("edit", "delete", "rename", "archive", "unarchive"):
        return f"gh repo {args[1]} (a repo setting)"
    if args[:1] != ["api"]:
        return None
    method, path, i, fields = "", "", 1, False
    while i < len(args):
        a = args[i]
        if a in ("-X", "--method") and i + 1 < len(args):
            method, i = args[i + 1].upper(), i + 2
            continue
        if a.startswith("-X") and len(a) > 2:
            method = a[2:].upper()
        elif a.startswith("--method="):
            method = a.split("=", 1)[1].upper()
        elif a in ("-f", "-F", "--field", "--raw-field", "--input") or a.startswith(("--field=", "--raw-field=", "--input=")):
            fields = True
        elif not a.startswith("-") and not path and args[i - 1] not in ("-H", "--header", "-q", "--jq", "-t", "--template",
                                                                        "-f", "-F", "--field", "--raw-field", "--input", "--hostname", "--cache"):
            path = a.split("?", 1)[0]
        i += 1
    method = method or ("POST" if fields else "GET")
    if method == "GET":
        return None
    if MERGE.search(path):
        return "a pull request merge through the API (the owner merges)"
    if SETTINGS.match(path):
        return f"{method} {path} (a repo setting)"
    return None


def why(tool, data):
    if tool.startswith("mcp__github__"):
        name = tool[len("mcp__github__"):]
        if "merge_pull_request" in name or "auto_merge" in name:
            return "merging a pull request (the owner merges)"
        if "secret" in name or name in ("update_repository", "delete_repository"):
            return f"{name} (a secret or repo setting)"
        return None
    if tool != "Bash":
        return None
    for words in segments(data.get("command", "")):
        head, args = words[0], words[1:]
        if head in ("wrangler", "wrangler2") or head.startswith("wrangler@"):
            found = wrangler(args)
        elif head == "git":
            while args[:1] in (["-C"], ["-c"]):
                args = args[2:]
            found = git_push(args)
        elif head == "gh":
            found = gh(args)
        else:
            found = None
        if found:
            return found
    return None


if __name__ == "__main__":
    root = repo()
    data = event()
    if root is None or duplicate(root) or os.environ.get("LOOPY_OWNER_APPROVED") == "1":
        sys.exit(0)
    found = why(data.get("tool_name", ""), data.get("tool_input") or {})
    if found:
        sys.stderr.write(f"Blocked: {found}. {ASK}\n")
        sys.exit(2)
