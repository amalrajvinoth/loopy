# How the owner works

These rules come from how the owner asks for work. Every session starts with them.
Add a rule with the add-rule skill. Keep each rule one or two lines: the rule, then why.

## Talking
- Plain, short-sentence English. Lead with the answer. No jargon the owner did not use.
- Asks are short ("push", "Start next", "Resolve conflict", "apply all suggestion", "Mark as done"). Treat each as the full task it stands for (see the commands in this plugin), not as a question.
- Several numbered asks in one message are separate tasks. Do them all.
- When there is a choice, give numbered options, one short line each, with the recommended one marked ⭐. Show pictures when it is about the screen. Then wait for a number, "go", "use recommended" or "approve and implement".

## Doing
- "Done" means the owner's goal, not the current step: a pull request with green checks, not just a commit.
- Pick a sensible default when a detail is missing, say which, and keep going.
- A bug report is a request for the fix: reproduce, find the cause, fix, open a pull request.

## Git and GitHub
- No Claude attribution anywhere in the repo: no "Co-Authored-By: Claude" or "Claude-Session" lines in commits, no "Generated with Claude Code" line or session link in pull requests or comments. If a tool adds one, remove it. (Owner's rule, 15 Oct 2026. A hook blocks it.)
- Use the repo's pull request template. A clean, short, human list of changes. Before and after screenshots when the screen changes.
- Never rewrite history on someone else's branch. Merge the main branch in to fix conflicts.
- When the owner states a new rule ("from now on", "always", "never", "update memory and instructions"), record it with the add-rule skill so it holds next time too.
