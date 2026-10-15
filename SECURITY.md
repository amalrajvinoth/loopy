# Security

Thank you for helping keep Loopy and the kids who use it safe.

## How to report a problem

**Please do not report security problems in public issues or discussions.**

Report them privately here:
https://github.com/amalrajvinoth/loopy/security/advisories/new

Only the owner can see your report. Please tell us:

- What the problem is
- Where it is (which page or file)
- How to see it happen, step by step

We aim to reply within 7 days. We will tell you when it is fixed, and thank you by name if you want.

## What Loopy does to stay safe

- **No personal data.** No accounts, no ads, no tracking, no analytics. Stars and settings stay in the browser on your device.
- **No third parties.** Fonts and all files are served from the Loopy site itself. The page never sends data anywhere.
- **Content Security Policy.** Every page tells the browser to only load files from Loopy, to never send data to other sites, and to never submit forms. Each page also allows only its own code to run, by a fingerprint (hash), so injected scripts or styles are blocked. `python3 tools/csp.py` keeps the fingerprints up to date, and a GitHub check fails if they are not.
- **No outside code.** Loopy uses no libraries or packages, so there are no supply-chain risks to patch.
- **Safe text handling.** Game text is added with `textContent`, not as HTML, so pasted codes cannot run scripts.
- **Checked saved data.** Settings and stars read from the browser are checked before use. A stars code is only accepted if it is short, well formed, and holds sane numbers for known games.
- **Automatic checks.** Every push and pull request runs `tools/csp.py --check` and `tools/check_external.py` on GitHub. The action they use is pinned to an exact version, and Dependabot proposes updates to it.
- **security.txt.** Security researchers can find how to reach us at `/.well-known/security.txt`, the standard place.
- **HTTPS only.** GitHub Pages serves the site over HTTPS.
- **Reviewed changes.** Changes to `main` go through a pull request reviewed by the owner.

## Known limits

- GitHub Pages cannot send HTTP headers, so the policy lives in a `<meta>` tag. That covers everything except `frame-ancestors`, so another site could show Loopy inside a frame. Loopy has no logins or forms, so there is nothing to steal that way.
- Each game's code sits inside its own page. That is why the policy allows it by fingerprint rather than by file.

## Supported versions

Only the live site (the `main` branch) is supported.
