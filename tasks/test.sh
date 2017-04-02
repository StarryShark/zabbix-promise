#!/usr/bin/env

set -ev

export PATH="./node_modules/.bin:$PATH"

# linting check
eslint .

# run tests for zabbix 3.0
docker-compose -f docker-compose-30.yml up -d
sleep 30
docker-compose -f docker-compose-30.yml ps
mocha
docker-compose -f docker-compose-30.yml down

# run tests for zabbix 3.2
docker-compose -f docker-compose-32.yml up -d
sleep 30
docker-compose -f docker-compose-32.yml ps
mocha
docker-compose -f docker-compose-32.yml down

# vulnerability scanner
nsp check
