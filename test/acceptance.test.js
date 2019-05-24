const Zabbix = require('../index')
const t = require('tap')
const test = t.test

const zabbix = new Zabbix({
  url: 'http://127.0.0.1:8080/api_jsonrpc.php',
  user: 'Admin',
  password: 'zabbix'
})

// We need host group name to create a new host group and it will return the
// group id that we will store in hostGroupId. We need host group id to create
// a new host later.
const hostGroupName = 'zabbix-promise-group'
let hostGroupId = null

// We need host name to create a new host and it will return the host id that we
// will store in hostId. We need host id to create a new item later.
const hostName = 'zabbix-promise-host'
let hostId = null

// We need item name and key to create Zabbix trapper item.
const itemName = 'zabbix-promise-item'
const itemKey = 'zabbix.promise.key'

const main = async () => {
  await test('User login', async t => {
    await t.resolves(zabbix.login())

    t.type(await new Zabbix({
      url: 'http://127.0.0.1:8080/api_jsonrpc.php',
      user: 'Admin',
      password: 'zabbix'
    }).login(), 'string', 'return value type is string')

    // Wrong username
    t.rejects(new Zabbix({
      url: 'http://127.0.0.1:8080/api_jsonrpc.php',
      user: 'Admin1',
      password: 'zabbix'
    }).login(), 'expect rejected Promise for wrong username')

    // Wrong password
    t.rejects(new Zabbix({
      url: 'http://127.0.0.1:8080/api_jsonrpc.php',
      user: 'Admin',
      password: 'zabbix1'
    }).login(), 'expect rejected Promise for wrong password')

    // Wrong port
    t.rejects(new Zabbix({
      url: 'http://127.0.0.1:80801/api_jsonrpc.php',
      user: 'Admin',
      password: 'zabbix'
    }).login(), 'expect rejected Promise for wrong URL')

    // HTTPS URL
    t.rejects(new Zabbix({
      url: 'https://localhost:8080/api_jsonrpc.php',
      user: 'Admin',
      password: 'zabbix'
    }).login(), 'expect rejected Promise for HTTPS')
  })

  await test('Create hostgroup', async t => {
    const result = await zabbix.request('hostgroup.get', {
      filter: { name: hostGroupName }
    })
    if (result.length === 0) {
      const value = await zabbix.request('hostgroup.create', { name: hostGroupName })
      hostGroupId = value.groupids[0]
      t.match(hostGroupId, /[0-9]+/g, `${hostGroupName} created`)
    } else {
      hostGroupId = result[0].groupid
      t.match(hostGroupId, /[0-9]+/g, `${hostGroupName} already exists`)
    }
  })

  await test('Create host', async t => {
    const result = await zabbix.request('host.get', {
      filter: { host: hostName }
    })
    if (result.length === 0) {
      const value = await zabbix.request('host.create', {
        host: hostName,
        groups: [{ groupid: hostGroupId }],
        interfaces: [{
          type: 1,
          main: 1,
          useip: 1,
          ip: '127.0.0.1',
          dns: '',
          port: '10050'
        }]
      })
      hostId = value.hostids[0]
      t.match(hostId, /[0-9]+/g, `${hostName} created`)
    } else {
      hostId = result[0].hostid
      t.match(hostId, /[0-9]+/g, `${hostName} already exists`)
    }
  })

  await test('Create item', async t => {
    const result = await zabbix.request('item.get', {
      hostids: hostId,
      search: { key_: itemKey }
    })
    if (result.length === 0) {
      const value = await zabbix.request('item.create', {
        hostid: hostId,
        key_: itemKey,
        name: itemName,
        type: 2, // 2 - Zabbix trapper
        value_type: 0 // 0 - numeric float
      })
      t.match(value.itemids[0], /[0-9]+/g, `${itemName} created, please wait for 60 seconds.`)
      await new Promise(resolve => setTimeout(resolve, 60000))
    } else {
      t.match(result[0].itemid, /[0-9]+/g, `${itemName} already exists`)
    }
  })

  await test('Zabbix sender', async t => {
    t.resolves(Zabbix.sender({
      server: '127.0.0.1',
      host: hostName,
      key: itemKey,
      value: Math.random()
    }))

    // Wrong host name
    t.rejects(Zabbix.sender({
      server: '127.0.0.1',
      host: hostName + 'zabbix',
      key: itemKey,
      value: Math.random()
    }), 'expect rejected Promise for wrong host name')

    // Wrong port
    t.rejects(Zabbix.sender({
      server: '127.0.0.1',
      port: 1234,
      host: hostName,
      key: itemKey,
      value: Math.random()
    }), 'expect rejected Promise for wrong server port')

    // Missing server
    t.rejects(Zabbix.sender({
      host: hostName,
      key: itemKey,
      value: Math.random()
    }), 'expect rejected Promise for missing server')

    // Missing host
    t.rejects(Zabbix.sender({
      server: '127.0.0.1',
      key: itemKey,
      value: Math.random()
    }), 'expect rejected Promise for missing host')

    // Missing key
    t.rejects(Zabbix.sender({
      server: '127.0.0.1',
      host: hostName,
      value: Math.random()
    }), 'expect rejected Promise for missing key')

    // Missing value
    t.rejects(Zabbix.sender({
      server: '127.0.0.1',
      host: hostName,
      key: itemKey
    }), 'expect rejected Promise for missing value')
  })

  await test('User logout', async t => {
    await t.resolveMatch(zabbix.logout(), /true/g)
    t.rejects(zabbix.logout())
  })
}
main()
