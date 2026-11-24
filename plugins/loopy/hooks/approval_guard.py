#!/usr/bin/env python3
"""PreToolUse on Bash and the GitHub tools: stop the steps that only the owner may take.

main is live (GitHub Pages deploys it), and a merged sync/ change deploys the Family sync Worker and runs its
table files on the live databases. So these wait for the owner's yes, never Claude's own judgement:
  - deploying: wrangler deploy / publish / rollback / delete / restore, wherever the word stands (pages deploy, triggers deploy)
  - the live databases and other live resources: any wrangler command with --remote, wrangler d1 create
  - secrets: wrangler secret, gh secret, gh variable
  - main: git push to main, --all or --mirror, a force push (--force-with-lease on a work branch stays allowed)
  - merging: gh pr merge, the REST merge, auto-merge and merges calls, a GraphQL merge, the GitHub merge tools
  - writing to main through the API: contents without branch= (it goes to main), git/refs/heads/main, push_files to main
  - repo settings: gh repo edit / delete / rename / archive, gh ruleset, gh api writes to the repo itself, its
    rulesets, branch protection, Pages, collaborators, hooks, secrets, variables, Actions permissions, environments

A tool name counts anywhere in a command (sudo -u x, timeout, nohup, xargs, npx in front), bash -c '...' and
bash <<EOF are read too. This only adds refusals. It is a safety net, not a sandbox: a shell can always hide a command
from a pattern. The settings deny list, the main branch rules on GitHub and the owner's own merge are the locks behind it.

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
SHELLS = {"bash", "sh", "zsh", "dash"}
MAIN = ("main", "master", "refs/heads/main", "refs/heads/master")
RISKY_GRAPHQL = re.compile(r"mutation[\s\S]*\b(merge\w*|enablePullRequestAutoMerge|\w*Repository\w*|\w*BranchProtection\w*|"
                           r"\w*Ruleset\w*|updateRefs?|createCommitOnBranch|\w*Secret\w*)\s*\(", re.I)


def base(word):
    return word.rsplit("/", 1)[-1]


def strip_heredocs(cmd):
    """Drop a heredoc's body (text written to a file is not a command), but keep the rest of its first line, and keep
    the body when a shell reads it (bash <<EOF runs every line)."""
    def keep(m):
        before = cmd[cmd.rfind("\n", 0, m.start()) + 1:m.start()].split()
        if any(base(w) in SHELLS for w in before):
            body = "\n" + m.group(4)
        elif not m.group(1):  # unquoted: $(...) and `...` in the body still run
            body = "".join("\n" + s for s in re.findall(r"\$\(([^()]*)\)|`([^`]*)`", m.group(4)) for s in s if s)
        else:
            body = ""
        return " " + m.group(3) + body + "\n"
    return re.sub(r"<<-?\s*(['\"]?)(\w+)\1([^\n]*)\n(.*?)\n\s*\2\s*(?=\n|$)", keep, cmd, flags=re.S)


def segments(cmd):
    """The commands in a shell line, split on ; && || | ( ) and new lines outside quotes. # is not a comment here:
    shlex would end the line at x#, where bash goes on."""
    lex = shlex.shlex(strip_heredocs(cmd), posix=True, punctuation_chars=";&|()\n")
    lex.whitespace, lex.whitespace_split, lex.commenters = " \t\r", True, ""
    try:
        tokens = list(lex)
    except ValueError:
        tokens = cmd.split()
    words = []
    for tok in tokens + [";"]:
        if tok and set(tok) <= OPS:
            if words:
                yield words
            words = []
        else:
            words.append(tok)


def branch(cwd=None):
    try:
        return subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=cwd, capture_output=True, text=True, timeout=5).stdout.strip()
    except (OSError, subprocess.TimeoutExpired):
        return ""


def wrangler(args):
    if "--remote" in args or any(a.startswith("--remote=") for a in args):
        return "a wrangler command with --remote (live Cloudflare data)"
    if "--local" in args:
        return None
    words = [a for a in args if not a.startswith("-")]
    if "secret" in words:
        return "wrangler secret (a secret)"
    hit = {"deploy", "publish", "rollback", "delete", "restore"} & set(words)
    if hit:
        return f"wrangler {sorted(hit)[0]} (a live change)"
    if words[:2] == ["d1", "create"]:
        return "wrangler d1 create (a live database)"
    return None


def git(args, state):
    cwd, config = None, []
    while args and args[0].startswith("-"):
        if args[0] in ("-C", "-c", "--git-dir", "--work-tree", "--namespace") and len(args) > 1:
            cwd = args[1] if args[0] == "-C" else cwd
            config += [args[1]] if args[0] == "-c" else []
            args = args[2:]
        else:
            config += [args[0].split("=", 1)[-1]] if args[0].startswith("--config-env") else []
            args = args[1:]
    if args[:1] in (["switch"], ["checkout"]) and any(a in MAIN for a in args[1:]):
        state["main"] = True  # a later push of HEAD in this line pushes main
    if not args or args[0] != "push":
        return None
    if any(re.match(r"(remote\.[^=]*\.push|push\.default|branch\.[^=]*\.merge)", c, re.I) for c in config):
        return "a push with its destination set by -c (it can go to main)"
    flags = [a for a in args[1:] if a.startswith("-")]
    refs = [a for a in args[1:] if not a.startswith("-")]
    if any(f in ("--force", "-f") or re.fullmatch(r"-[a-zA-Z]*f[a-zA-Z]*", f) for f in flags) or any(r.startswith("+") for r in refs[1:]):
        return "a force push"
    if "--all" in flags or "--mirror" in flags:
        return "git push --all or --mirror (it pushes main too)"
    targets = [r.split(":")[-1] for r in refs[1:]]
    if any(t in MAIN or "*" in t or t == "" for t in targets) or "--branches" in flags:
        return "a push to main (main is live; a * or : refspec reaches it too)"
    if (len(refs) <= 1 or any(t in ("HEAD", "@") for t in targets)) and (state.get("main") or branch(cwd) in ("main", "master")):
        return "a push from the main branch (main is live)"
    return None


def gh_api(args):
    method, path, fields, i = "", "", [], 0
    while i < len(args):
        a = args[i]
        if a in ("-X", "--method") and i + 1 < len(args):
            method, i = args[i + 1].upper(), i + 2
            continue
        if a in ("-f", "-F", "--field", "--raw-field", "--input") and i + 1 < len(args):
            fields.append(args[i + 1])
            i += 2
            continue
        if a in ("-H", "--header", "-q", "--jq", "-t", "--template", "--hostname", "--cache", "-p", "--preview") and i + 1 < len(args):
            i += 2
            continue
        if a.startswith("-X") and len(a) > 2:
            method = a[2:].upper()
        elif a.startswith("--method="):
            method = a.split("=", 1)[1].upper()
        elif re.match(r"-[fF].", a):
            fields.append(a[2:])
        elif a.startswith(("--field=", "--raw-field=", "--input=")):
            fields.append(a.split("=", 1)[1])
        elif not a.startswith("-") and not path:
            path = a.split("?", 1)[0].strip("/")
        i += 1
    method = method or ("POST" if fields else "GET")
    if path == "graphql":
        return "a GraphQL change that merges or touches settings or main" if any(RISKY_GRAPHQL.search(a) for a in args) else None
    if method == "GET":
        return None
    if MERGE.search(path):
        return "a pull request merge through the API (the owner merges)"
    if re.fullmatch(r"repos/[^/]+/[^/]+/(merges|transfer)", path):
        return f"{method} {path} (a merge or a repo move)"
    if re.fullmatch(r"repos/[^/]+/[^/]+/git/refs/heads/(main|master)", path) or (
            re.fullmatch(r"repos/[^/]+/[^/]+/git/refs", path) and any(v.split("=", 1)[-1] in MAIN for v in fields)):
        return f"{method} {path} (moves main)"
    if re.match(r"repos/[^/]+/[^/]+/contents/", path):
        branches = [v.split("=", 1)[1] for v in fields if v.startswith("branch=")]
        if not branches or any(b in MAIN for b in branches):
            return f"{method} {path} (a file written to main; without branch= it goes to main)"
    if SETTINGS.match(path):
        return f"{method} {path} (a repo setting)"
    return None


def gh(args):
    words, i = [], 0
    while i < len(args):
        if args[i] in ("-R", "--repo") and i + 1 < len(args):
            i += 2
            continue
        if not args[i].startswith("-"):
            words.append(args[i])
        i += 1
    if words[:1] == ["api"]:
        return gh_api(args[args.index("api") + 1:])
    if words[:1] == ["pr"] and "merge" in words[1:2]:
        return "gh pr merge (the owner merges)"
    if words[:1] in (["secret"], ["variable"], ["ruleset"]):
        return f"gh {words[0]} (a secret or repo setting)"
    if words[:1] == ["repo"] and len(words) > 1 and words[1] in ("edit", "delete", "rename", "archive", "unarchive"):
        return f"gh repo {words[1]} (a repo setting)"
    return None


def bash(cmd, depth=0, state=None):
    """The first owner's step in a shell line. A tool name is looked for anywhere in a command, so sudo -u x,
    timeout 60, nohup, xargs or npx in front cannot hide it, and bash -c '...' is read too."""
    state = {} if state is None else state
    for words in segments(cmd):
        for i, w in enumerate(words):
            name, rest = base(w), words[i + 1:]
            found = None
            if name in SHELLS and "-c" in rest and depth < 3:
                j = rest.index("-c")
                found = bash(rest[j + 1], depth + 1, state) if j + 1 < len(rest) else None
            elif name in ("wrangler", "wrangler2") or name.startswith("wrangler@"):
                found = wrangler(rest)
            elif name == "git":
                found = git(rest, state)
            elif name == "gh":
                found = gh(rest)
            if found:
                return found
    return None


def why(tool, data):
    if tool.startswith("mcp__github__"):
        name = tool[len("mcp__github__"):]
        if "merge" in name:
            return "merging (the owner merges)"
        if "secret" in name or name in ("update_repository", "delete_repository", "transfer_repository"):
            return f"{name} (a secret or repo setting)"
        if name in ("push_files", "create_or_update_file", "delete_file") and str(data.get("branch", "main")) in MAIN:
            return f"{name} to main (main is live)"
        return None
    return bash(data.get("command", "")) if tool == "Bash" else None


if __name__ == "__main__":
    root = repo()
    data = event()
    if root is None or duplicate(root) or os.environ.get("LOOPY_OWNER_APPROVED") == "1":
        sys.exit(0)
    found = why(data.get("tool_name", ""), data.get("tool_input") or {})
    if found:
        sys.stderr.write(f"Blocked: {found}. {ASK}\n")
        sys.exit(2)
