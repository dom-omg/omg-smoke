#!/bin/bash
# apply-design-all.sh — applique le design profile à tous les repos Next.js
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPOS_DIR="$(dirname "$SCRIPT_DIR")"

for dir in "$REPOS_DIR"/*/; do
  [ -f "$dir/package.json" ] || continue
  grep -q '"next"' "$dir/package.json" 2>/dev/null || continue
  bash "$SCRIPT_DIR/apply-design.sh" "$dir"
done
