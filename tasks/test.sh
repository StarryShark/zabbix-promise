#!/bin/bash

set -ev

export PATH="./node_modules/.bin:$PATH"

export DBUSER='postgres'
export DBPASS='postgres'

# linting check
standard

# run tests for zabbix
for VAR in 'alpine-3.0-latest' 'alpine-4.0-latest' 'alpine-4.2-latest'
do
  export ZABTAG="$VAR"

  printf "\n>>> Building Zabbix %s conatiners.\n\n" "$VAR"
  docker-compose -p "$VAR" up -d
  printf '\n' && sleep 2
  docker-compose -p "$VAR" ps

  printf '\n>>> Please allow 10 seconds for the application to start entirely.\n'
  sleep 10

  printf '\n>>> Running the test cases.\n\n'
  node test/acceptance.test.js

  # exit 0
  printf '\n>>> Tests passed, deleting the containers.\n\n'
  docker-compose -p "$VAR" down
done
