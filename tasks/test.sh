#!/bin/bash

set -ev

export PATH="./node_modules/.bin:$PATH"

export DBUSER='postgres'
export DBPASS='postgres'
export HOSTPORT='8080'

# linting check
standard

# run tests for zabbix
for VAR in 'alpine-3.0-latest' 'alpine-3.2-latest'
do
  export ZABTAG="$VAR"
  docker-compose -p "$VAR" up -d
  sleep 30
  docker-compose -p "$VAR" ps

  if [ "$CI" = 'true' ]; then
    istanbul cover ./node_modules/.bin/_mocha --report lcovonly -- -R spec
    coveralls < ./coverage/lcov.info
    rm -rf ./coverage
  else
    istanbul cover ./node_modules/.bin/_mocha --report lcovonly -- -R spec
  fi

  docker-compose -p "$VAR" down
done
