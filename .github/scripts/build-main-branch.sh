#!/bin/bash
# Build main branch to generate stats.json for comparison

set -e

BASE_REF="$1"
CHANGED_APPS="$2"

CURRENT_REF=$(git rev-parse HEAD)
git fetch origin "$BASE_REF" --depth=1
git checkout -b temp-main-branch FETCH_HEAD
pnpm install

mkdir -p main-stats
for app in $CHANGED_APPS; do
  if [ ! -d "$app" ]; then
    echo "Skipping $app - does not exist on main branch"
    continue
  fi
  app_name=$(basename "$app")
  echo "Building $app on main branch..."
  
  # Try to build with ANALYZE=true
  if ANALYZE=true pnpm turbo build --filter="./$app" --env-mode=strict; then
    echo "✓ Built $app successfully"
  elif ANALYZE=true pnpm turbo build --filter="$app_name" --env-mode=strict; then
    echo "✓ Built $app successfully"
  else
    echo "✗ Failed to build $app on main branch"
    continue
  fi
  
  # Check if stats.json was created
  if [ -f "$app/.next/stats.json" ]; then
    cp "$app/.next/stats.json" "main-stats/${app_name}-stats.json"
    echo "✓ Copied stats.json for $app_name"
    echo "  File size: $(ls -lh "main-stats/${app_name}-stats.json" | awk '{print $5}')"
    # Verify the file is different for each app by checking first few lines
    echo "  First chunk names in stats:"
    node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync('main-stats/${app_name}-stats.json','utf-8')); console.log(s.chunks?.slice(0,3).map(c=>c.names?.[0]||'no-name').join(', ') || 'no chunks');" 2>/dev/null || echo "  Could not parse stats"
  else
    echo "✗ stats.json not found for $app_name"
    echo "  Checking $app/.next/ directory:"
    ls -la "$app/.next/" 2>/dev/null || echo "  .next directory does not exist"
    echo "  Looking for stats.json in $app:"
    find "$app" -name "stats.json" 2>/dev/null || echo "  No stats.json found"
  fi
done

echo "Main stats files:"
ls -la main-stats/ || echo "No stats files found"

# Check if any stats were collected
if [ ! -d "main-stats" ] || [ -z "$(ls -A main-stats 2>/dev/null)" ]; then
  echo "⚠️ Warning: No stats files collected from main branch build"
fi

git checkout "$CURRENT_REF"

