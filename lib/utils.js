const Zabbix = require('./api');
const { exec } = require('child_process');
const debug = require('debug')('utils');

class Client extends Zabbix {

  static sender(options) {

    // $FlowFixMe: more research needed
    return new Promise((resolve, reject) => {
      // eslint-disable-line max-statements, max-len

      if (!Object.prototype.hasOwnProperty.call(options, 'path')) {

        reject(new Error('Please provide full path for zabbix_sender ' + 'utility.'));
      } // eslint: path

      if (!Object.prototype.hasOwnProperty.call(options, 'server')) {

        reject(new Error('Please provide zabbix server or proxy name.'));
      } // eslint: server

      if (!Object.prototype.hasOwnProperty.call(options, 'port')) {

        options.port = '10051';
      } // eslint: port

      if (!Object.prototype.hasOwnProperty.call(options, 'host')) {

        reject(new Error('Please provide the zabbix host name as ' + 'registered in Zabbix frontend.'));
      } // eslint: host

      if (!Object.prototype.hasOwnProperty.call(options, 'values')) {

        reject(new Error('Specify values each line contains whitespace ' + 'delimited: - <key> <value>'));
      } // eslint: values

      resolve(options);
    }).then(val => {

      const { path, server, port, host, values } = val;

      return new Promise((resolve, reject) => {

        debug('zabbix_sender options: %O', val);

        let cmd = `printf -- '${values}' | ${path} -vv -z ${server} `;
        cmd += `-p ${port} -s ${host} -r -i -`;

        exec(cmd, (error, stdout, stderr) => {

          if (error) {

            return reject(error);
          }

          return resolve({
            stdout,
            stderr
          });
        }); // eslint: exec
      }); // eslint: promise
    }); // eslint: then

  } // eslint: sender

} // eslint: Class

module.exports = Client;