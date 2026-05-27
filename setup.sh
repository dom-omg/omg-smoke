#!/bin/bash
# setup.sh — installe Playwright smoke tests dans un repo Next.js
# Usage: bash setup.sh [chemin/vers/repo]
# Idempotent — safe à re-runner

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="${1:-.}"
REPO=$(realpath "$REPO")
REPO_NAME=$(basename "$REPO")

# Vérifier que c'est un projet Next.js
if ! grep -q '"next"' "$REPO/package.json" 2>/dev/null; then
  echo "SKIP $REPO_NAME — pas Next.js"
  exit 0
fi

# Idempotent check
if [ -f "$REPO/tests/smoke.spec.ts" ]; then
  echo "✓ $REPO_NAME — déjà setup"
  exit 0
fi

echo "→ Setup: $REPO_NAME"

# Tests directory
mkdir -p "$REPO/tests"

# Smoke test
cp "$SCRIPT_DIR/templates/smoke.spec.ts" "$REPO/tests/smoke.spec.ts"
echo "  + tests/smoke.spec.ts"

# Playwright config (skip si existe déjà)
if [ ! -f "$REPO/playwright.config.ts" ]; then
  cp "$SCRIPT_DIR/templates/playwright.config.ts" "$REPO/playwright.config.ts"
  echo "  + playwright.config.ts"
fi

# GitHub Actions workflow
mkdir -p "$REPO/.github/workflows"
if [ ! -f "$REPO/.github/workflows/e2e.yml" ]; then
  cp "$SCRIPT_DIR/templates/e2e.yml" "$REPO/.github/workflows/e2e.yml"
  echo "  + .github/workflows/e2e.yml"
fi

# package.json — ajoute devDep + scripts
node -e "
const fs = require('fs')
const path = '$REPO/package.json'
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'))

let changed = false

pkg.devDependencies = pkg.devDependencies || {}
if (!pkg.devDependencies['@playwright/test']) {
  pkg.devDependencies['@playwright/test'] = '^1.44.0'
  changed = true
  process.stdout.write('  + @playwright/test\n')
}

pkg.scripts = pkg.scripts || {}
if (!pkg.scripts['test:e2e']) {
  pkg.scripts['test:e2e'] = 'playwright test'
  changed = true
  process.stdout.write('  + script test:e2e\n')
}
if (!pkg.scripts['test:e2e:ui']) {
  pkg.scripts['test:e2e:ui'] = 'playwright test --ui'
  changed = true
}

if (changed) {
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n')
}
"

# Pre-push hook
HOOK="$REPO/.git/hooks/pre-push"
if [ -d "$REPO/.git" ] && ! grep -q "smoke-check" "$HOOK" 2>/dev/null; then
  cat > "$HOOK" << 'HOOK_EOF'
#!/bin/sh
# smoke-check

echo "→ TypeScript check..."
npx tsc --noEmit 2>&1
if [ $? -ne 0 ]; then
  echo "✗ TypeScript errors — push bloqué"
  exit 1
fi

# Playwright seulement si dev server déjà up
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if echo "$HTTP_CODE" | grep -qE "^[23]"; then
  echo "→ Dev server up — smoke tests..."
  npx playwright test --reporter=dot 2>&1
  if [ $? -ne 0 ]; then
    echo "✗ Smoke tests failed — push bloqué"
    exit 1
  fi
else
  echo "  (dev server non détecté — lance 'npm run test:e2e' avant push)"
fi

echo "✓ Pre-push OK"
HOOK_EOF
  chmod +x "$HOOK"
  echo "  + pre-push hook"
fi

# .gitignore — ajoute entries Playwright si pas déjà là
GITIGNORE="$REPO/.gitignore"
if [ -f "$GITIGNORE" ] && ! grep -q "playwright-report" "$GITIGNORE"; then
  printf "\n# Playwright\nplaywright-report/\ntest-results/\n" >> "$GITIGNORE"
  echo "  + .gitignore entries"
elif [ ! -f "$GITIGNORE" ]; then
  printf "# Playwright\nplaywright-report/\ntest-results/\n" > "$GITIGNORE"
fi

echo "✓ $REPO_NAME — done"
