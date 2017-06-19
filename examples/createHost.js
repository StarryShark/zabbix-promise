const Zabbix = require('../index');

const whiteSpaceCount = 2;
const zabbix = new Zabbix(
  'http://127.0.0.1:8080/api_jsonrpc.php',
  'Admin',
  'zabbix'
);

zabbix.login()
  .then(() => zabbix.request('host.create', {
    'host': 'zabbix-agent1',
    'groups': [{'groupid': '2'}],
    'interfaces': [
      {
        'dns': 'zabbix-agent1',
        'ip': '',
        'main': 1,
        'port': '10050',
        'type': 1,
        'useip': 0
      }
    ],
    'templates': [{'templateid': '10001'}],
    'inventory_mode': 1
  }))
  .then((value) => console.log(JSON.stringify(value, null, whiteSpaceCount)))
  .then(() => zabbix.logout())
  .catch((reason) =>
    console.log(JSON.stringify(reason, null, whiteSpaceCount))
  );
