#!/bin/bash

set -ev

export PATH="./node_modules/.bin:$PATH"

export DBUSER='postgres'
export DBPASS='postgres'
export HOSTPORT='8080'

# linting check
eslint .

# run tests for zabbix
for VAR in 'alpine-3.0-latest' 'alpine-3.2-latest'
do
  export ZABTAG="$VAR"
  docker-compose -p "$VAR" up -d
  sleep 30
  docker-compose -p "$VAR" ps
  mocha
  docker-compose -p "$VAR" down
done

# vulnerability scanner
nsp check
