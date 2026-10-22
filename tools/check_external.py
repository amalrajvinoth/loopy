#!/usr/bin/env python3
"""Fail if any page, script or stylesheet points at another website.

Loopy promises that the browser only talks to Loopy. Links to GitHub on the help page are
the one exception (they are plain links, not files the page loads). Family sync's server
(Loopy.syncHost) is not a file a page loads: it is reached with fetch() only on devices where a
grown-up turned sync on, and the page policy (tools/csp.py) allows that one address and no other.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = [p for p in ROOT.rglob("*") if p.suffix in (".html", ".js", ".css", ".webmanifest") and ".git" not in p.parts and "node_modules" not in p.parts]
URL = re.compile(r"https?://[^\s\"'()<>]+")
ALLOWED_LINK_HOSTS = ("github.com/amalrajvinoth/loopy",)
LOADS = re.compile(r'\b(src|href)\s*=\s*"(https?://[^"]+)"|url\(\s*["\']?(https?://[^)"\']+)', re.I)

bad = 0
for f in FILES:
    text = f.read_text(encoding="utf-8")
    rel = f.relative_to(ROOT)
    for m in LOADS.finditer(text):
        url = m.group(2) or m.group(3)
        tag = text[max(0, m.start() - 40):m.start()]
        is_link = m.group(1) and m.group(1).lower() == "href" and "<a " in tag.lower()
        if is_link and url.startswith("https://" + ALLOWED_LINK_HOSTS[0]):
            continue
        if url.startswith("http://www.w3.org/"):
            continue  # XML namespace, nothing is downloaded
        print(f"{rel}: loads or links to {url}")
        bad += 1
if bad:
    print("Loopy must not load anything from other websites. Store the file in this repo instead.")
else:
    print(f"Checked {len(FILES)} files: nothing is loaded from other websites.")
sys.exit(1 if bad else 0)
