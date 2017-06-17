const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Zabbix = require('../index');

const {expect} = chai;
const zabbix = new Zabbix(
  'http://127.0.0.1:8080/api_jsonrpc.php',
  'Admin',
  'zabbix'
);

chai.use(chaiAsPromised);

describe('host actions:', () => {

  const hosts = [
    {
      'name': 'zabbix-agent1',
      'id': '',
      'gid': '2',
      'tid': '10001'
    },
    {
      'name': 'zabbix-agent2',
      'id': '',
      'gid': '2',
      'tid': '10001'
    },
    {
      'name': 'zabbix-agent3',
      'id': '',
      'gid': '2',
      'tid': '10001'
    }
  ];

  it('login', () => expect(zabbix.login()).to.be.fulfilled
    .and.to.eventually.be.a('string'));

  hosts.forEach((host) => {

    it(`create host ${host.name}`, () => expect(zabbix.request('host.create', {
      'host': host.name,
      'groups': [{'groupid': host.gid}],
      'interfaces': [
        {
          'dns': host.name,
          'ip': '',
          'main': 1,
          'port': '10050',
          'type': 1,
          'useip': 0
        }
      ]
    }).then((value) => {

      [host.id] = value.hostids;

      return value;

    })).to.be.fulfilled.and.to.eventually.be.an('Object'));

  });

  it(`update host ${hosts[0].name}`, () => expect(
    zabbix.request('host.update', {
      'hostid': hosts[0].id,
      'templates': [{'templateid': hosts[0].tid}],
      'inventory_mode': 1
    })).to.be.fulfilled.and.to.eventually.be.an('Object'));

  it(`get host ${hosts[0].name}`, () => expect(zabbix.request('host.get', {
    'output': [
      'hostid',
      'host'
    ],
    'hostids': hosts[0].id
  })).to.be.fulfilled.and.to.eventually.be.an('Array'));

  it(`add template to ${hosts[1].name}, ${hosts[2].name}`, () => expect(
    zabbix.request('host.massadd', {
      'hosts': [
        {'hostid': hosts[1].id},
        {'hostid': hosts[2].id}
      ],
      'templates': [{'templateid': hosts[1].tid}]
    })).to.be.fulfilled.and.to.eventually.be.an('Object'));

  it(`update inventory contact ${hosts[1].name}, ${hosts[2].name}`,
    () => expect(zabbix.request('host.massupdate', {
      'hosts': [
        {'hostid': hosts[1].id},
        {'hostid': hosts[2].id}
      ],
      'inventory': {'contact': 'Sumit Goel'},
      'inventory_mode': 1
    })).to.be.fulfilled.and.to.eventually.be.an('Object'));

  it(`unlink and clear template from ${hosts[1].name}, ${hosts[2].name}`,
    () => expect(zabbix.request('host.massremove', {
      'hostids': [
        hosts[1].id,
        hosts[2].id
      ],
      'templateids_clear': hosts[1].tid
    })).to.be.fulfilled.and.to.eventually.be.an('Object'));

  hosts.forEach((host) => {

    it(`delete host ${host.name}`, () => expect(
      zabbix.request('host.delete', [host.id]))
      .to.be.fulfilled.and.to.eventually.be.an('Object'));

  });

});
