#!/bin/bash

set -ev

if [ -z "$TRAVIS_TAG" ]; then
  # git config --local user.name "${github_username:?}"
  # git config --local user.email "${github_email:?}"
  # TRAVIS_TAG=$(jq .version package.json | tr -d '"')
  # export TRAVIS_TAG
  # git tag "v$TRAVIS_TAG"
  echo 'Hey there!'
fi
