#!/bin/bash

set -ev

export PATH="./node_modules/.bin:$PATH"

DIR=$(pwd)

# Uncomment the below lines to regenerate the self signed certificates
#
# cd "$DIR"/tasks/ssl
# rm -f ./*
# openssl req -out ssl.csr -new -newkey rsa:2048 -nodes -keyout ssl.key -subj "/C=US/ST=California/L=San Francisco/O=sumitgoelpw/OU=zabbix-promise/CN=zabbix-web.local/emailAddress=email@example.com"
# openssl x509 -req -sha256 -days 365 -in ssl.csr -signkey ssl.key -out ssl.crt
# openssl dhparam -out dhparam.pem 2048
# cd "$DIR"

export DBUSER='postgres'
export DBPASS='postgres'
export HOSTPORT='8080'
export HOSTPORTSSL='8443'
export NGINXDIRSSL="$DIR/tasks/ssl"

# linting check
eslint .

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
