const Zabbix = require('../index');

// Warning: BAD idea, you may wanna check out ssl-root-cas package on npm
// For HTTPS URL you may have to uncomment line 6
// eslint-disable-next-line no-process-env
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const whiteSpaceCount = 2;

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
  .then((value) => console.log(JSON.stringify(value, null, whiteSpaceCount)))
  .catch((reason) =>
    console.log(JSON.stringify(reason, null, whiteSpaceCount))
  );
