#!/usr/bin/env bash
# Auto-commit a newly written report file and push to trigger Vercel deploy.
# Called by Claude Code PostToolUse hook on Write tool.
# Env: CLAUDE_TOOL_INPUT_FILE_PATH — the path just written by the Write tool.

set -euo pipefail

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

# Only act on files inside the reports/ directory with .md extension
if [[ -z "$FILE" || "$FILE" != *"/reports/"*.md ]]; then
  exit 0
fi

REPO="/Users/louyuxian/trading"
cd "$REPO"

# Make sure the file exists (Write may have just created it)
if [[ ! -f "$FILE" ]]; then
  exit 0
fi

FNAME=$(basename "$FILE" .md)

git add "$FILE"

# Only commit if there are staged changes (file might already be tracked)
if git diff --cached --quiet; then
  exit 0
fi

git commit -m "report: $FNAME"
git push origin main

echo "[auto-commit] pushed $FNAME to origin/main"
