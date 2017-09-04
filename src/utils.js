// @flow

const Zabbix = require('./api');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Client extends Zabbix {

  static sender (options: {|
    path: string,
    server: string,
    port: string,
    host: string,
    values: string
  |}) {

    // $FlowFixMe: more research needed
    return new Promise((resolve, reject) => { // eslint-disable-line max-statements, max-len

      if (!Object.prototype.hasOwnProperty.call(options, 'path')) {

        reject(new Error('Please provide full path for zabbix_sender ' +
                'utility.'));

      } // eslint: path

      if (!Object.prototype.hasOwnProperty.call(options, 'server')) {

        reject(new Error('Please provide zabbix server or proxy name.'));

      } // eslint: server

      if (!Object.prototype.hasOwnProperty.call(options, 'port')) {

        options.port = '10051';

      } // eslint: port

      if (!Object.prototype.hasOwnProperty.call(options, 'host')) {

        reject(new Error('Please provide the zabbix host name as ' +
                'registered in Zabbix frontend.'));

      } // eslint: host

      if (!Object.prototype.hasOwnProperty.call(options, 'values')) {

        reject(new Error('Specify values each line contains whitespace ' +
                'delimited: - <key> <value>'));

      } // eslint: values

      resolve(options);

    })
      .then((val) => {

        const {path, server, port, host, values} = val;
        return exec(`printf -- '${values}' | ${path} -vv -z ${server} ` +
          `-p ${port} -s ${host} -r -i -`);

      });


  } // eslint: sender

} // eslint: Class

module.exports = Client;
