#!/bin/bash
# Compare bundles and generate markdown reports

set -e

CHANGED_APPS="$1"
HAS_MAIN_STATS="$2"

mkdir -p comparison-results
all_comparisons=""

echo "=== Debug Info ==="
echo "has_main_stats: $HAS_MAIN_STATS"
echo "Changed apps: $CHANGED_APPS"
echo "=================="

for app in $CHANGED_APPS; do
  app_name=$(basename "$app")
  main_stats="main-stats/${app_name}-stats.json"
  pr_stats="${app}/.next/stats.json"
  
  echo "Processing $app_name..."
  echo "  PR stats path: $pr_stats"
  echo "  Main stats path: $main_stats"
  
  # Debug: Check if files exist and show their sizes
  if [ -f "$main_stats" ]; then
    echo "  ✓ Main stats file exists: $(ls -lh "$main_stats" | awk '{print $5}')"
  else
    echo "  ✗ Main stats file NOT found: $main_stats"
  fi
  if [ -f "$pr_stats" ]; then
    echo "  ✓ PR stats file exists: $(ls -lh "$pr_stats" | awk '{print $5}')"
  else
    echo "  ✗ PR stats file NOT found: $pr_stats"
  fi
  
  if [ ! -f "$pr_stats" ]; then
    echo "  ✗ PR stats not found for $app_name at $pr_stats, skipping"
    continue
  fi
  echo "  ✓ PR stats found"
  
  if [ "$HAS_MAIN_STATS" != "true" ] || [ ! -f "$main_stats" ]; then
    echo "Main stats not available for $app_name"
    echo "This might be the first build or main branch stats are not available yet."
    echo "Showing PR bundle size only for $app_name"
    
    # Generate stats summary without comparison
    pr_size=$(node -e "
      const fs = require('fs');
      const stats = JSON.parse(fs.readFileSync('$pr_stats', 'utf-8'));
      let total = 0;
      if (stats.chunks) {
        stats.chunks.forEach(chunk => {
          if (chunk.parsedSize !== undefined) {
            total += chunk.parsedSize;
          } else if (chunk.size) {
            total += chunk.size;
          }
        });
      }
      console.log((total / 1024).toFixed(2));
    ")
    
    comparison="## 📦 Bundle Size Analysis - $app_name

⚠️ **Main branch stats not available** - This might be the first PR or main branch hasn't been built yet.

**Current PR Bundle Size:** ${pr_size} KB

*Note: Comparison will be available after main branch is built.*"
    
    echo "$comparison" > "comparison-results/${app_name}.md"
    
    if [ -z "$all_comparisons" ]; then
      all_comparisons="$comparison"
    else
      all_comparisons="$all_comparisons

---

$comparison"
    fi
    continue
  fi
  
  echo "Comparing $app_name..."
  comparison=$(node scripts/compare-bundles.js "$main_stats" "$pr_stats")
  
  # Add app name to the title
  comparison_with_app=$(echo "$comparison" | sed "s/## 📦 Bundle Size Comparison/## 📦 Bundle Size Comparison - $app_name/")
  echo "$comparison_with_app" > "comparison-results/${app_name}.md"
  
  if [ -z "$all_comparisons" ]; then
    all_comparisons="$comparison_with_app"
  else
    all_comparisons="$all_comparisons

---

$comparison_with_app"
  fi
done

echo "=== Final Check ==="
echo "all_comparisons length: ${#all_comparisons}"
if [ -z "$all_comparisons" ]; then
  echo "No comparisons generated"
  echo "has_comparison=false" >> $GITHUB_OUTPUT
  echo "comparison=" >> $GITHUB_OUTPUT
else
  echo "Comparisons generated successfully"
  echo "has_comparison=true" >> $GITHUB_OUTPUT
  # Escape for multiline output
  {
    echo 'comparison<<EOF'
    echo "$all_comparisons"
    echo 'EOF'
  } >> $GITHUB_OUTPUT
fi

