#!/bin/bash
# apply-design.sh — injecte le design profile dans un repo Next.js
# Usage: bash apply-design.sh [chemin/vers/repo]
# Le profile est auto-détecté selon le nom du repo.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="${1:-.}"
REPO=$(realpath "$REPO")
REPO_NAME=$(basename "$REPO")

# Vérifier Next.js
if ! grep -q '"next"' "$REPO/package.json" 2>/dev/null; then
  echo "SKIP $REPO_NAME — pas Next.js"
  exit 0
fi

# ── Détection du profil ─────────────────────────────────────────────────────

INTEL_REPOS="u-cant-hide wraith chain-guardian trace-landing cansec-demo omg-eyes omg-notify wick-recon find-evil bounty-radar hunthead lazarus-bounty omg-vision-relay"
OPS_REPOS="ordr-ai aurora skyveil spvm-insight vigie vigil sentinel intel-dashboard rapace spatial-editor"
PROOF_REPOS="verdict-engine cobalt-pqc cobalt-platform cobalt-forge cobalt-live proofnode prism prism-dsa wick-security aegis-hub ironproof-sentinel"

detect_profile() {
  local name="$1"
  for r in $INTEL_REPOS; do [ "$name" = "$r" ] && echo "intel" && return; done
  for r in $OPS_REPOS;   do [ "$name" = "$r" ] && echo "ops"   && return; done
  for r in $PROOF_REPOS; do [ "$name" = "$r" ] && echo "proof" && return; done
  echo "proof"  # default: cleanest base
}

PROFILE=$(detect_profile "$REPO_NAME")

# ── Idempotent check ─────────────────────────────────────────────────────────

GLOBALS=""
for candidate in \
  "$REPO/src/app/globals.css" \
  "$REPO/app/globals.css" \
  "$REPO/styles/globals.css" \
  "$REPO/src/styles/globals.css"; do
  [ -f "$candidate" ] && GLOBALS="$candidate" && break
done

if [ -z "$GLOBALS" ]; then
  echo "SKIP $REPO_NAME — globals.css non trouvé"
  exit 0
fi

if grep -q "OMG DESIGN PROFILE: $(echo $PROFILE | tr '[:lower:]' '[:upper:]')" "$GLOBALS" 2>/dev/null; then
  echo "✓ $REPO_NAME — déjà $PROFILE"
  exit 0
fi

echo "→ $REPO_NAME [$PROFILE]"

# ── Apply globals.css ────────────────────────────────────────────────────────

# Retirer un ancien profile si présent
if grep -q "OMG DESIGN PROFILE:" "$GLOBALS"; then
  # Supprimer tout ce qui vient après le marqueur
  sed -i '/\/\* OMG DESIGN PROFILE:/,$d' "$GLOBALS"
fi

# Ajouter le nouveau profile à la fin
echo "" >> "$GLOBALS"
cat "$SCRIPT_DIR/profiles/$PROFILE/globals.css" >> "$GLOBALS"
echo "  + globals.css ($PROFILE)"

# ── Copy motion files ────────────────────────────────────────────────────────

# Détecter la structure src/ ou non
if [ -d "$REPO/src" ]; then
  LIB_DIR="$REPO/src/lib"
  COMP_DIR="$REPO/src/components/ui"
else
  LIB_DIR="$REPO/lib"
  COMP_DIR="$REPO/components/ui"
fi

mkdir -p "$LIB_DIR" "$COMP_DIR"

if [ ! -f "$LIB_DIR/motion.ts" ]; then
  cp "$SCRIPT_DIR/profiles/$PROFILE/lib/motion.ts" "$LIB_DIR/motion.ts"
  echo "  + lib/motion.ts"
fi

if [ ! -f "$COMP_DIR/motion.tsx" ]; then
  cp "$SCRIPT_DIR/profiles/$PROFILE/components/motion.tsx" "$COMP_DIR/motion.tsx"
  echo "  + components/ui/motion.tsx"
fi

# ── Add framer-motion to package.json ───────────────────────────────────────

node -e "
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('$REPO/package.json', 'utf8'))
pkg.dependencies = pkg.dependencies || {}
if (!pkg.dependencies['framer-motion']) {
  pkg.dependencies['framer-motion'] = '^11.0.0'
  fs.writeFileSync('$REPO/package.json', JSON.stringify(pkg, null, 2) + '\n')
  process.stdout.write('  + framer-motion\n')
}
"

echo "✓ $REPO_NAME [$PROFILE] done"
