#!/usr/bin/env python3
"""Read one iteration's JSON from `claude -p --output-format json` and print: STATUS COST.

STATUS is the last "STATUS: DONE | CONTINUE | BLOCKED" line Claude wrote, ERROR when the run did not
finish normally, CONTINUE when Claude forgot the line. COST is total_cost_usd, 0 when unknown."""
import json, re, sys

try:
    r = json.load(open(sys.argv[1], encoding="utf-8"))
    text = r.get("result") or ""
    cost = float(r.get("total_cost_usd") or 0)
    found = re.findall(r"^STATUS:\s*(DONE|CONTINUE|BLOCKED)\b", text, re.M)
    status = found[-1] if found else ("ERROR" if r.get("is_error") else "CONTINUE")
except Exception:
    status, cost = "ERROR", 0.0
print(status, f"{cost:.4f}")
