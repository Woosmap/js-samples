#!/bin/bash
set -e

tmp=`mktemp -d`

for sample in dist/samples/*/; do
  name=`basename $sample`
  branch="sample/${name}"

  pushd $tmp
    rm -rf .git
    git init
    git config user.name 'gaelsimon'
    git config user.email 'gael.simon@woosmap.com'

    if [ -n "$GITHUB_TOKEN" ]; then
      git remote add origin "https://gaelsimon:$GITHUB_TOKEN@github.com/woosmap/js-samples.git"
    else
      git remote add origin "git@github.com:woosmap/js-samples.git"
    fi

    git checkout -B $branch
    git rm -rqf . || true
    git clean -fxd
  popd

  cp -r $sample/app/* $tmp

  # manually copy all files beginning with .
  cp $sample/app/.env $tmp/.env
  cp $sample/app/.eslintrc.json $tmp/.eslintrc.json
  cp $sample/app/.gitignore $tmp/.gitignore


  pushd $tmp
    git add -A
    git commit -am "chore: sync ${name} [skip-ci]" --no-verify || true
    git push -q --set-upstream origin $branch -f
    git status
  popd
done
