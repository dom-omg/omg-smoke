#!/bin/bash
# apply-all.sh — applique smoke setup à tous les repos Next.js dans ../
# Usage: bash apply-all.sh [--dry-run]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPOS_DIR="$(dirname "$SCRIPT_DIR")"
DRY_RUN=false

if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
  echo "=== DRY RUN ==="
fi

APPLIED=0
SKIPPED=0
FAILED=0
FAILED_LIST=""

for dir in "$REPOS_DIR"/*/; do
  [ -d "$dir" ] || continue
  [ -f "$dir/package.json" ] || continue

  if grep -q '"next"' "$dir/package.json" 2>/dev/null; then
    if $DRY_RUN; then
      name=$(basename "$dir")
      if [ -f "$dir/tests/smoke.spec.ts" ]; then
        echo "✓ $name — déjà setup"
        SKIPPED=$((SKIPPED + 1))
      else
        echo "→ $name — sera setup"
        APPLIED=$((APPLIED + 1))
      fi
    else
      if bash "$SCRIPT_DIR/setup.sh" "$dir"; then
        if grep -q "déjà setup" <<< "$(bash "$SCRIPT_DIR/setup.sh" "$dir" 2>&1)"; then
          SKIPPED=$((SKIPPED + 1))
        else
          APPLIED=$((APPLIED + 1))
        fi
      else
        FAILED=$((FAILED + 1))
        FAILED_LIST="$FAILED_LIST $(basename $dir)"
      fi
    fi
  fi
done

echo ""
echo "=== RÉSUMÉ ==="
echo "  Applied : $APPLIED"
echo "  Skipped : $SKIPPED"
if [ $FAILED -gt 0 ]; then
  echo "  Failed  : $FAILED → $FAILED_LIST"
fi
