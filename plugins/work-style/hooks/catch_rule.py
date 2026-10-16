#!/usr/bin/env python3
"""UserPromptSubmit: notice when the owner states a new standing rule, so the plugin learns it.

Prints a short note for Claude (it becomes context, the owner does not see it). Never blocks.
"""
import json, re, sys

RULE = re.compile(
    r"\b(from now on|going forward|always|never|every (change|time|pr|pull request|game)|"
    r"(update|add to) (the )?(memory|instructions|global instructions|project instructions)|"
    r"add (or update )?a (skill|rule)|make (it|this) a rule|don'?t ever|do not ever)\b",
    re.I)

try:
    prompt = json.load(sys.stdin).get("prompt", "")
except (ValueError, AttributeError):
    sys.exit(0)

if isinstance(prompt, str) and RULE.search(prompt):
    print("work-style: this message may state a new standing rule. After doing what it asks, "
          "record the rule with the add-rule skill (RULES.md in the right plugin, plus "
          "project memory and instructions if this session has them), so later sessions follow it. "
          "If it is a one-off ask, ignore this note.")
