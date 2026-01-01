#!/bin/bash
# Detect changed Next.js apps for main branch builds

set -e

PREV_SHA=$(git rev-parse HEAD^1 2>/dev/null || echo "")
CHANGED_APPS=""

if [ -n "$PREV_SHA" ]; then
  CHANGED_APPS=$(pnpm turbo list --filter="[${PREV_SHA}]..." --json 2>/dev/null | jq -r '.[] | select(.task == "build") | .package' | grep -E "^(apps/docs|apps/web)$" || true)
fi

# If no changes detected or turbo list failed, check all Next.js apps
if [ -z "$CHANGED_APPS" ]; then
  echo "No changes detected or first build - building all Next.js apps"
  CHANGED_APPS="apps/docs apps/web"
fi

# Filter out apps that don't exist
EXISTING_APPS=""
for app in $CHANGED_APPS; do
  if [ -d "$app" ]; then
    if [ -z "$EXISTING_APPS" ]; then
      EXISTING_APPS="$app"
    else
      EXISTING_APPS="$EXISTING_APPS $app"
    fi
  else
    echo "Skipping $app - directory does not exist"
  fi
done

if [ -z "$EXISTING_APPS" ]; then
  echo "No Next.js apps found, skipping..."
  echo "apps=" >> $GITHUB_OUTPUT
  exit 0
fi

echo "apps=$EXISTING_APPS" >> $GITHUB_OUTPUT
echo "Changed apps: $EXISTING_APPS"

