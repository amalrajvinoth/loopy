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

- **No personal data.** No accounts, no ads, no tracking, no analytics. Stars and settings stay in the browser on your device. The one thing a person can give is their own email, under Stay in touch in Settings, and only by tapping Save (see below).
- **No third parties.** Fonts and all files are served from the Loopy site itself. The page never sends data anywhere, except the locked Family sync copy on a device where a grown-up turned it on (below).
- **Content Security Policy.** Every page tells the browser to only load files from Loopy, to never send data to other sites, and to never submit forms. Each page also allows only its own code to run, by a fingerprint (hash), so injected scripts or styles are blocked. Scripts may only fetch Loopy's own files (`connect-src 'self'`): "Report a problem" reads the fonts and `sw.js` to make its picture and version line. `python3 tools/csp.py` keeps the fingerprints up to date, and a GitHub check fails if they are not.
- **Family sync is locked and off by default.** Family sync (`src/loopy-sync.js`, server in `sync/`) is the one thing that sends data, and only on a device where a grown-up turned it on. Before anything leaves the device it is locked (AES-GCM) with a key made from the 16-letter family code (PBKDF2, 200,000 rounds). The server only keeps that locked copy and cannot read it: it never sees the code or the key. Writing needs a second key from the same code, and the server keeps only a hash of it. The page policy allows this one server address (`Loopy.syncHost`, `loopy-sync.loopy-1e2.workers.dev`) and no other. With sync off, `loopy-sync.js` is never loaded and nothing is sent (`tools/e2e/sync.mjs` checks this).
- **Stay in touch is opt-in and separate.** A grown-up's email (`POST /g` on the same server) is kept in its own D1 database in the EU with only the language and the time. The device keeps a random remove key and the server only its hash. So only that device can delete the row. The owner can delete rows by hand. Emails are deleted after 2 years. The nightly `stats` row holds counts only. The privacy note (`privacy/`) says all this in plain words.
- **No outside code.** Loopy uses no libraries or packages, so there are no supply-chain risks to patch.
- **Safe text handling.** Game text is added with `textContent`, not as HTML, so pasted codes cannot run scripts.
- **Checked saved data.** Settings and stars read from the browser are checked before use. A stars code is only accepted if it is short, well formed, and unpacks to a small size. Every value in it is checked the same way as saved data: known games, real dates, sane numbers and short texts. Anything else is dropped. Nothing in a code is ever run. Child names are plain text, at most 12 letters, and pictures come from a fixed list.
- **Automatic checks.** Every push and pull request runs `tools/csp.py --check` and `tools/check_external.py` on GitHub. The action they use is pinned to an exact version, and Dependabot proposes updates to it.
- **security.txt.** Security researchers can find how to reach us at `/.well-known/security.txt`, the standard place.
- **HTTPS only.** GitHub Pages serves the site over HTTPS.
- **Reviewed changes.** Changes to `main` go through a pull request reviewed by the owner.

## Known limits

- GitHub Pages cannot send HTTP headers, so the policy lives in a `<meta>` tag. That covers everything except `frame-ancestors`, so another site could show Loopy inside a frame. Loopy has no logins or forms, so there is nothing to steal that way.
- Each game's code sits inside its own page. That is why the policy allows it by fingerprint rather than by file.

## Supported versions

Only the live site (the `main` branch) is supported.
