#!/usr/bin/env python3
"""Turn a loopy GitHub issue into .ralph/TASK.md, with its pictures saved next to it.

    python3 tools/ralph/issue.py 147 .ralph

No login is needed: the repo is public. Pictures in the issue text (![...](url) and <img src>) are
downloaded to .ralph/issue/, so Claude can open them with the Read tool and see what is wanted."""
import json, pathlib, re, sys, urllib.request

n, state = sys.argv[1], pathlib.Path(sys.argv[2])
(state / "issue").mkdir(parents=True, exist_ok=True)
api = f"https://api.github.com/repos/amalrajvinoth/loopy/issues/{n}"
req = urllib.request.Request(api, headers={"Accept": "application/vnd.github+json", "User-Agent": "loopy-ralph"})
issue = json.load(urllib.request.urlopen(req, timeout=30))
body = (issue.get("body") or "").strip()

urls = re.findall(r"!\[[^\]]*\]\((https?://[^)\s]+)\)", body) + re.findall(r'<img[^>]+src="(https?://[^"]+)"', body)
pics = []
for i, url in enumerate(dict.fromkeys(urls), 1):
    low = url.lower()
    ext = ".jpg" if ".jp" in low else ".svg" if ".svg" in low else ".gif" if ".gif" in low else ".png"
    path = state / "issue" / f"picture-{i}{ext}"
    try:
        r = urllib.request.Request(url, headers={"User-Agent": "loopy-ralph"})
        path.write_bytes(urllib.request.urlopen(r, timeout=60).read())
        pics.append(f"- `{path}` (from {url})")
    except Exception as e:  # a picture that cannot be fetched is noted, never fatal
        pics.append(f"- could not download {url}: {e}")

lines = [f"# Issue #{n}: {issue['title']}", "", f"https://github.com/amalrajvinoth/loopy/issues/{n}", "", body, ""]
if pics:
    lines += ["## Pictures from the issue", "", "Open each one with the Read tool before you start. They show what is wanted.", ""] + pics + [""]
lines += ["## Done when", "",
          "- What the issue asks for works, in English and German, on a phone with no scrolling.",
          "- Every check in LOOP_INSTRUCTIONS passes.",
          f"- The docs that describe it are updated (loopy-docs skill). The pull request will say \"Closes #{n}\".", ""]
(state / "TASK.md").write_text("\n".join(lines), encoding="utf-8")
print(f"Task: {issue['title']} ({len(pics)} picture(s))")
