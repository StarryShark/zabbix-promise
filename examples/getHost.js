/**
 * In this example, we will query Zabbix hosts and apply a filter for host
 * "zabbix-promise-host" and include the interfaces as well.
 */

const Zabbix = require('../index')

const zabbix = new Zabbix({
  url: 'http://127.0.0.1:8080/api_jsonrpc.php',
  user: 'Admin',
  password: 'zabbix'
})

const main = async () => {
  try {
    await zabbix.login()
    const hosts = await zabbix.request('host.get', {
      selectInterfaces: 'extend',
      filter: {
        host: 'zabbix-promise-host'
      }
    })
    console.log(JSON.stringify(hosts, null, 2))
    zabbix.logout()
  } catch (error) {
    console.error(error)
  }
}
main()
