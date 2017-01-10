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

describe('Host', () => {

  it('login', () => expect(zabbix.login()).to.be.fulfilled
    .and.to.eventually.be.a('string'));

  it('getHost', () => expect(zabbix.getHost({
    'output': ['hostid', 'host'],
    'limit': 1
  })).to.be.fulfilled.and.to.eventually.be.an('Array'));

});
