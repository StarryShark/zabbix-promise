const Zabbix = require('../index');

const whiteSpaceCount = 2;
const zabbix = new Zabbix(
  'http://127.0.0.1:8080/api_jsonrpc.php',
  'Admin',
  'zabbix'
);

zabbix.login()
  .then(() => zabbix.request('host.get', {
    'output': [
      'hostid',
      'host'
    ],
    'limit': 1
  }))
  .then((value) => console.log(JSON.stringify(value, null, whiteSpaceCount)))
  .then(() => zabbix.logout())
  .catch((reason) =>
    console.log(JSON.stringify(reason, null, whiteSpaceCount))
  );
