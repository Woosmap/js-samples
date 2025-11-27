#!/bin/bash
set -e

# Suppress git init warnings
git config --global init.defaultBranch master

tmp=`mktemp -d`

for sample in dist/samples/*/; do
  name=`basename $sample`
  branch="sample/${name}"

  echo "Processing $name to branch $branch..."

  pushd $tmp
    rm -rf .git
    git init

    # Using wgsadmin as requested
    git config user.name 'wgsadmin'
    git config user.email 'operations@webgeoservices.com'

    if [ -n "$GITHUB_TOKEN" ]; then
      # Authenticated remote using the token passed from the workflow
      git remote add origin "https://x-access-token:$GITHUB_TOKEN@github.com/woosmap/js-samples.git"
    else
      # Fallback for local testing
      git remote add origin "git@github.com:woosmap/js-samples.git"
    fi

    git checkout -B $branch
    git rm -rqf . || true
    git clean -fxd
  popd

  cp -r $sample/app/* $tmp

  # Manually copy config files
  [ -f "$sample/app/.env" ] && cp "$sample/app/.env" "$tmp/.env"
  [ -f "$sample/app/.eslintrc.json" ] && cp "$sample/app/.eslintrc.json" "$tmp/.eslintrc.json"
  [ -f "$sample/app/.gitignore" ] && cp "$sample/app/.gitignore" "$tmp/.gitignore"

  pushd $tmp
    git add -A
    git commit -am "chore: sync ${name} [skip-ci]" --no-verify || true
    git push -q --set-upstream origin $branch -f
  popd
done