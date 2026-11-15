#!/usr/bin/env bash
# Zet de huidige branch live via main, zonder werk van anderen te overschrijven:
# eerst origin/main samenvoegen, dan de controles, dan pushen (branch én main).
# Gebruik: npm run naar-main
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" = "main" ]; then echo "Werk op een eigen branch, niet op main." >&2; exit 1; fi
if [ -n "$(git status --porcelain)" ]; then echo "Commit eerst je wijzigingen." >&2; exit 1; fi

echo "→ origin/main ophalen en samenvoegen"
git fetch origin main
if ! git merge --no-edit origin/main; then
  echo "Samenvoegconflict: los het op, commit, en draai dit script opnieuw." >&2
  exit 1
fi

echo "→ controles"
npm run lint
npm run typecheck
npm test
npm run build

echo "→ pushen"
git push -u origin "$branch"
# Zonder --force: is main intussen weer veranderd, dan weigert git en draai je dit script opnieuw.
git push origin "HEAD:main"
echo "✅ $branch staat op main ($(git rev-parse --short HEAD)). Vercel zet hem live."
