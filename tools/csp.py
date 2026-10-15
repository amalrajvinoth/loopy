#!/usr/bin/env python3
"""Keep the Content Security Policy on every page in step with the page's own code.

Each page allows only its own inline <script> and <style> blocks, by hash. Run this after
editing any page:   python3 tools/csp.py
Check without changing anything (used by the GitHub check):   python3 tools/csp.py --check
"""
import base64, hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
META = re.compile(r'<meta http-equiv="Content-Security-Policy" content="[^"]*">')
BLOCK = re.compile(r"<(script|style)(\s[^>]*)?>(.*?)</\1>", re.S)
INLINE_ATTR = re.compile(r'<[^>]+\sstyle="', re.I)
HANDLER = re.compile(r'<[^>]+\son[a-z]+="', re.I)


def hashes(html, kind):
    out = []
    for tag, attrs, body in BLOCK.findall(html):
        if tag != kind or (attrs and "src=" in attrs):
            continue
        out.append("'sha256-" + base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode() + "'")
    return out


def policy(html):
    script = " ".join(["'self'"] + hashes(html, "script"))
    style = " ".join(["'self'"] + hashes(html, "style"))
    return (f"default-src 'self'; script-src {script}; style-src {style}; img-src 'self' data:; font-src 'self'; "
            "connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; manifest-src 'self'; "
            "upgrade-insecure-requests")


def main():
    check = "--check" in sys.argv
    bad = 0
    for page in PAGES:
        html = page.read_text(encoding="utf-8")
        rel = page.relative_to(ROOT)
        if INLINE_ATTR.search(html):
            print(f"{rel}: has a style=\"...\" attribute. Move it to a class, the policy blocks inline styles.")
            bad += 1
        if HANDLER.search(html):
            print(f"{rel}: has an on...=\"\" handler. Use addEventListener, the policy blocks inline handlers.")
            bad += 1
        tag = f'<meta http-equiv="Content-Security-Policy" content="{policy(html)}">'
        if not META.search(html):
            print(f"{rel}: has no Content-Security-Policy meta tag.")
            bad += 1
        elif META.search(html).group(0) != tag:
            if check:
                print(f"{rel}: policy is out of date. Run: python3 tools/csp.py")
                bad += 1
            else:
                page.write_text(META.sub(lambda m: tag, html, count=1), encoding="utf-8")
                print(f"{rel}: updated")
    if check and not bad:
        print(f"All {len(PAGES)} pages have an up-to-date policy.")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
