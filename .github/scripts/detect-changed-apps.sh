#!/bin/bash
# Detect changed Next.js apps in the repository

set -e

BASE_REF="${1:-origin/main}"
CHANGED_APPS=""

echo "=== Changed files ==="
git diff --name-only "$BASE_REF"...HEAD || true
echo "===================="

# Check for changes in apps/web
if git diff --name-only "$BASE_REF"...HEAD | grep -q "^apps/web/"; then
  CHANGED_APPS="apps/web"
  echo "✓ apps/web has changes"
fi

# Check for changes in apps/docs
if git diff --name-only "$BASE_REF"...HEAD | grep -q "^apps/docs/"; then
  if [ -n "$CHANGED_APPS" ]; then
    CHANGED_APPS="$CHANGED_APPS apps/docs"
  else
    CHANGED_APPS="apps/docs"
  fi
  echo "✓ apps/docs has changes"
fi

# If no changes detected, check if apps exist and build all
if [ -z "$CHANGED_APPS" ]; then
  echo "No changes detected via git diff, checking if apps exist..."
  if [ -d "apps/web" ]; then
    CHANGED_APPS="apps/web"
    echo "Building apps/web (no changes detected but app exists)"
  fi
  if [ -d "apps/docs" ]; then
    if [ -n "$CHANGED_APPS" ]; then
      CHANGED_APPS="$CHANGED_APPS apps/docs"
    else
      CHANGED_APPS="apps/docs"
    fi
    echo "Building apps/docs (no changes detected but app exists)"
  fi
fi

if [ -z "$CHANGED_APPS" ]; then
  echo "No Next.js apps found, skipping..."
  echo "apps=" >> $GITHUB_OUTPUT
  exit 0
fi

echo "apps=$CHANGED_APPS" >> $GITHUB_OUTPUT
echo "Final changed apps: $CHANGED_APPS"

