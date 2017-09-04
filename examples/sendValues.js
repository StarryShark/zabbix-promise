const zabbix = require('../index');

zabbix.sender({
  'path': '/usr/local/bin/zabbix_sender',
  'server': 'zabbix-dev',
  'host': 'CloudGenix-Events',
  'values': '- testing 444\n- testing 111\n'
})
  .then((value) => console.log(value))
  .catch((reason) => console.log(reason));
