/**
 * In this example, we will send values to Zabbix trapper item type. There is
 * no need for Zabbix Sender binary as zabbix-promise package implements the
 * sender protocol in native JavaScript/Node.js.
 */

const zabbix = require('../index')

const main = async () => {
  try {
    const result = await zabbix.sender({
      server: '127.0.0.1',
      host: 'zabbix-promise-host',
      key: 'zabbix.promise.key',
      value: Math.random()
    })
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
main()
