#!/bin/bash
# gh-reconnect.sh — re-auth GitHub si token expiré
# Usage: bash gh-reconnect.sh (ou source dans .bashrc comme alias)

echo "→ Checking GitHub auth..."

if gh auth status &>/dev/null; then
  echo "✓ GitHub OK ($(gh api user --jq .login 2>/dev/null))"
  exit 0
fi

echo "→ Token expiré — reconnexion SSH..."
gh auth refresh -h github.com -s repo,read:org,gist

echo "✓ Reconnecté"
