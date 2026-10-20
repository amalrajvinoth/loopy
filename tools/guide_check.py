#!/usr/bin/env python3
"""Every game on the home page has a page in the loopy guide, in English and German.

The guide's source is guide-src/ (see guide-src/README.md). A game in index.html's GAMES list,
like "math/box-multiply/", needs guide-src/src/content/docs/games/math/box-multiply.mdx, the same
file under docs/de/, and a line in guide-src/src/games.ts. Today's 10 is games/todays-10.mdx.

    python3 tools/guide_check.py        (exit code 1 if a page is missing)
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "guide-src" / "src" / "content" / "docs"
home = (ROOT / "index.html").read_text(encoding="utf-8")
listed = (ROOT / "guide-src" / "src" / "games.ts").read_text(encoding="utf-8")

games = list(dict.fromkeys(re.findall(r'\{ subject: "[a-z]+", path: "([a-z]+/[a-z0-9-]+)/"', home)))
pages = {g: f"games/{g}" for g in games}
pages["mix/daily-mix"] = "games/todays-10"

bad = 0
for game, page in pages.items():
    for lang in ("", "de/"):
        if not any((DOCS / f"{lang}{page}{ext}").exists() for ext in (".mdx", ".md")):
            print(f"{game}: no guide page {lang}{page}.mdx")
            bad += 1
    folder = game.split("/")[1]
    if game != "mix/daily-mix" and not re.search(rf'g\("{game.split("/")[0]}", "{folder}"', listed):
        print(f"{game}: missing in guide-src/src/games.ts")
        bad += 1
if bad:
    print("Add the missing pages (see guide-src/README.md, 'Add a page for a new game').")
else:
    print(f"All {len(pages)} games have a guide page in English and German.")
sys.exit(1 if bad else 0)
