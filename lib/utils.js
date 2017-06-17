const Zabbix = require('./api');

class Client extends Zabbix {

  sendValues () {

    console.log(`Coming soon... ${this.url}`);

  }

}

module.exports = Client;
