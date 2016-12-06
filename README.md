# zabbix-promise

Interact with the [Zabbix](https://www.zabbix.com/documentation/3.0/manual/api) API using `zabbix-promise` and ES2015 native promises.

## Install

`npm install zabbix-promise --save`

## Usage

```
const Zabbix = require('zabbix-promise');

const zabbix = new Zabbix(
  'http://127.0.0.1:8080/api_jsonrpc.php',
  'Admin',
  'zabbix'
);

zabbix.login()
  .then(() => zabbix.getHost({
    'output': ['hostid', 'host'],
    'limit': 1
  }))
  .then((value) => console.log(JSON.stringify(value, null, 2)))
  .catch((reason) =>
    console.log(JSON.stringify(reason, null, 2))
  );
```

## Documentation

- [API Docs](docs/index.md)

## Examples

- [getHost](examples/getHost.js)

## Testing

1. `docker-compose up`
2. `npm test`
