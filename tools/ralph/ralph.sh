#!/usr/bin/env bash
# The Ralph loop for loopy: Claude Code runs again and again, with a fresh memory each time, until a task
# is done. Files and git history are the memory. Read tools/ralph/README.md first.
#
#   tools/ralph/ralph.sh "Make the Pizza Fractions hint shorter on small phones"
#   tools/ralph/ralph.sh --issue 147                 the task is a GitHub issue (its text and pictures)
#   tools/ralph/ralph.sh --task my-task.md           the task is a file you wrote
#   tools/ralph/ralph.sh --name pizza --max 6 --sleep 60 --budget 3 --model claude-sonnet-5
#   tools/ralph/ralph.sh --name pizza --resume       carry on an earlier loop
#
# Each loop works in its own git worktree next to this repo (../loopy-ralph-<name>) on the branch
# ralph/<name>, never on main. It never pushes. When it stops, you read the branch and open the
# pull request yourself ("push" in Claude, or git push -u origin ralph/<name>).
#
# What stops it: Claude says STATUS: DONE and the checks pass; Claude says STATUS: BLOCKED; the
# iteration cap (--max, default 8); the cost budget (--budget, in dollars, default 5); a file named
# .ralph/STOP in the worktree (touch it to stop after the current iteration); or Ctrl-C.
set -eu

usage() { sed -n '2,20p' "$0"; exit "${1:-0}"; }

REPO=$(cd "$(dirname "$0")/../.." && pwd)
HERE="$REPO/tools/ralph"
TASK_TEXT="" TASK_FILE="" ISSUE="" NAME="" MAX=8 SLEEP=30 BUDGET=5 MODEL="" RESUME=0 MAX_TURNS=40

while [ $# -gt 0 ]; do
  case "$1" in
    --issue) ISSUE="$2"; shift 2 ;;
    --task) TASK_FILE="$2"; shift 2 ;;
    --name) NAME="$2"; shift 2 ;;
    --max) MAX="$2"; shift 2 ;;
    --sleep) SLEEP="$2"; shift 2 ;;
    --budget) BUDGET="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --max-turns) MAX_TURNS="$2"; shift 2 ;;
    --resume) RESUME=1; shift ;;
    -h|--help) usage ;;
    -*) echo "Unknown option: $1"; usage 1 ;;
    *) TASK_TEXT="$1"; shift ;;
  esac
done

command -v claude >/dev/null || { echo "claude is not installed. See https://code.claude.com/docs/en/setup"; exit 1; }
command -v python3 >/dev/null || { echo "python3 is needed (the loopy tools use it too)."; exit 1; }

if [ -n "$ISSUE" ]; then
  : "${NAME:=issue-$ISSUE}"
elif [ -n "$TASK_FILE" ]; then
  [ -f "$TASK_FILE" ] || { echo "No task file at $TASK_FILE."; exit 1; }
  # Absolute, because the loop changes into the worktree before it copies the file.
  TASK_FILE="$(cd "$(dirname "$TASK_FILE")" && pwd)/$(basename "$TASK_FILE")"
  : "${NAME:=$(basename "$TASK_FILE" .md)}"
elif [ -n "$TASK_TEXT" ]; then
  : "${NAME:=$(printf '%s' "$TASK_TEXT" | tr -cs 'A-Za-z0-9' '-' | tr 'A-Z' 'a-z' | cut -c1-40 | sed 's/^-//; s/-$//')}"
elif [ "$RESUME" = 1 ] && [ -n "$NAME" ]; then
  :
else
  usage 1
fi

WT="$(cd "$REPO/.." && pwd)/loopy-ralph-$NAME"
BRANCH="ralph/$NAME"
STATE=".ralph"

# 1. The worktree: a fresh branch from the latest main, or the one from last time.
cd "$REPO"
git fetch -q origin main
if [ -d "$WT" ]; then
  echo "Carrying on in $WT (branch $BRANCH)."
else
  [ "$RESUME" = 1 ] && { echo "Nothing to resume: $WT does not exist."; exit 1; }
  if git show-ref --quiet "refs/heads/$BRANCH"; then
    git worktree add -q "$WT" "$BRANCH"
  else
    git worktree add -q -b "$BRANCH" "$WT" origin/main
  fi
  echo "New worktree $WT on branch $BRANCH, from origin/main."
fi
cd "$WT"
mkdir -p "$STATE/outputs"   # .ralph/ is in the repo's .gitignore

# 2. The task file. Written once; later runs keep it.
if [ ! -f "$STATE/TASK.md" ]; then
  if [ -n "$ISSUE" ]; then
    echo "Reading issue #$ISSUE and its pictures."
    python3 "$HERE/issue.py" "$ISSUE" "$STATE"
  elif [ -n "$TASK_FILE" ]; then
    cp "$TASK_FILE" "$STATE/TASK.md"
  else
    printf '# Task\n\n%s\n\n## Done when\n\n- It works, in English and German, on a phone with no scrolling.\n- Every check in LOOP_INSTRUCTIONS passes.\n- The docs that describe it are updated.\n' "$TASK_TEXT" > "$STATE/TASK.md"
  fi
fi
[ -f "$STATE/PROGRESS.md" ] || printf '# Progress\n\nNewest at the bottom. Each iteration of the loop adds what it did, what is next and what blocks it.\n' > "$STATE/PROGRESS.md"
rm -f "$STATE/STOP"

# The checks that decide whether "done" is true. Claude's word alone is not enough.
verify() {
  python3 tools/build.py --check && python3 tools/csp.py --check && python3 tools/check_external.py \
    && python3 tools/guide_check.py && python3 tools/review.py && python3 plugins/sync.py --check \
    && python3 plugins/loopy/scripts/drift.py --quiet
}

ALLOWED="Read,Glob,Grep,Edit,Write,MultiEdit,Skill,Bash(python3 tools/:*),Bash(node tools/:*),Bash(python3 plugins/:*),Bash(git status:*),Bash(git diff:*),Bash(git log:*),Bash(git show:*),Bash(ls:*)"
SPENT=0
ERRORS=0
START=$(grep -c '^## Iteration ' "$STATE/PROGRESS.md" || true)
trap 'echo; echo "Stopped. The work so far is on branch $BRANCH in $WT."; exit 130' INT

i=$START
while [ "$i" -lt $((START + MAX)) ]; do
  i=$((i + 1))
  stamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "== Iteration $i of $((START + MAX)) at $stamp"
  prompt=$(cat "$HERE/LOOP_INSTRUCTIONS.md"; printf '\n\n---\n\n'; cat "$STATE/TASK.md"; printf '\n\n---\n\n'; tail -n 80 "$STATE/PROGRESS.md")
  out="$STATE/outputs/iteration-$i.json"
  set +e
  claude -p "$prompt" --output-format json --max-turns "$MAX_TURNS" --permission-mode acceptEdits \
    --allowedTools "$ALLOWED" ${MODEL:+--model "$MODEL"} > "$out" 2> "$STATE/outputs/iteration-$i.err"
  code=$?
  set -e
  # What Claude said, its STATUS line and what the run cost.
  read -r status cost <<EOT
$(python3 "$HERE/status.py" "$out")
EOT
  SPENT=$(python3 -c "print(round($SPENT + $cost, 4))")
  echo "   claude exit $code, status $status, cost \$$cost (total \$$SPENT)"

  # Verify, whatever Claude said.
  if verify > "$STATE/outputs/iteration-$i.checks" 2>&1; then checks=pass; else checks=fail; fi
  echo "   checks: $checks"

  # Remember it: a line in PROGRESS.md and a commit, so the next iteration (and you) can see it.
  {
    printf '\n## Iteration %s (%s)\n\n- Status: %s. Checks: %s. Cost: $%s.\n' "$i" "$stamp" "$status" "$checks" "$cost"
    [ "$checks" = fail ] && printf -- '- The checks failed. Fix this first next time:\n\n```\n%s\n```\n' "$(tail -n 25 "$STATE/outputs/iteration-$i.checks")"
    [ "$status" = ERROR ] && printf -- '- Claude did not finish normally (exit %s). See %s.\n' "$code" "$STATE/outputs/iteration-$i.err"
  } >> "$STATE/PROGRESS.md"
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git -c user.name="${GIT_AUTHOR_NAME:-ralph}" commit -q -m "ralph $NAME, iteration $i: $status, checks $checks" || true
  fi

  case "$status" in
    DONE)
      if [ "$checks" = pass ]; then echo "Done: the task is finished and every check passes."; break; fi
      echo "   Claude said DONE but the checks fail, so the loop goes on." ;;
    BLOCKED) echo "Blocked: Claude needs a person. Read the last entry in $STATE/PROGRESS.md."; break ;;
    ERROR) ERRORS=$((ERRORS + 1)); [ "$ERRORS" -ge 2 ] && { echo "Claude failed to run twice in a row. See $STATE/outputs/iteration-$i.err (not logged in? no network?)."; break; } ;;
    *) ERRORS=0 ;;
  esac
  [ -f "$STATE/STOP" ] && { echo "Stopped by $STATE/STOP."; break; }
  if python3 -c "import sys; sys.exit(0 if $SPENT >= $BUDGET else 1)"; then echo "Budget of \$$BUDGET reached."; break; fi
  [ "$i" -lt $((START + MAX)) ] && sleep "$SLEEP"
done

echo
echo "Branch: $BRANCH   Worktree: $WT   Spent: \$$SPENT"
echo "Look at it:   cd $WT && git log --oneline origin/main..HEAD && cat $STATE/PROGRESS.md"
echo "Ship it:      cd $WT && git push -u origin $BRANCH   then open the pull request (or say \"push\" in Claude there)."
echo "Remove it:    cd $REPO && git worktree remove $WT"
