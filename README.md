# zabbix-promise

Interact with the [Zabbix](https://www.zabbix.com/documentation/3.0/manual/api) API using `zabbix-promise` and ES2015 native promises.

## Install

`npm install zabbix-promise --save`

## Usage

```
const Zabbix = require('zabbix-promise');

const zabbix = new Zabbix(
  'http://zabbix.example.com/zabbix/api_jsonrpc.php',
  'username',
  'password'
);

zabbix.login()
  .then(() => zabbix.request('host.get', {
    'groupids': '247',
    'output': ['hostid', 'host']
  }))
  .then((value) => console.log(JSON.stringify(value, null, 2)))
  .catch((reason) =>
    console.log(JSON.stringify(reason, null, 2))
  );
```

## Examples

- [getHosts](examples/getHosts.js)
