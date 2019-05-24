/**
 * In this example, we will create a Zabbix host "yet-another-host".
 * We need at least one host group and interface details as this information
 * is required to create a new host. We will query the host groups and get the
 * last group id from the return values.
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
    const groups = await zabbix.request('hostgroup.get', {})
    const groupId = groups[groups.length - 1].groupid
    const host = await zabbix.request('host.create', {
      host: 'yet-another-host',
      groups: [{ groupid: groupId }],
      interfaces: [{
        type: 1,
        main: 1,
        useip: 1,
        ip: '127.0.0.1',
        dns: '',
        port: '10050'
      }]
    })
    console.log(host)
    zabbix.logout()
  } catch (error) {
    console.error(error)
  }
}
main()
