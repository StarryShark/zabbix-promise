const Zabbix = require('./api');
const {spawn} = require('child_process');
const debug = require('debug')('utils');

class Client extends Zabbix {

  static sender (options) {

    // eslint-disable-next-line max-statements
    return new Promise((resolve, reject) => {

      if (!Object.prototype.hasOwnProperty.call(options, 'path')) {

        options.port = 'zabbix_sender';

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

    }).then((val) => {

      const {path, server, port, host, values} = val;

      return new Promise((resolve, reject) => {

        debug('zabbix_sender options: %O', val);

        let stdout = '';
        let stderr = '';

        const cmd = spawn(path, [
          '-z',
          server,
          '-p',
          port,
          '-s',
          host,
          '-r',
          '-i',
          '-'
        ]);

        cmd.stdin.write(values);

        cmd.stdout.on('data', (data) => {
          stdout += data;
        });

        cmd.stderr.on('data', (data) => {
          stderr += data;
        });

        cmd.on('error', (err) => reject(new Error(err)));

        cmd.on('close', (code) => {
          if (code === 0) {
            resolve({
              stdout,
              stderr
            });
          } else {
            reject(new Error(`${path} process exited with code ${code}`));
          }
        });

        cmd.stdin.end();

      }); // eslint: promise

    }); // eslint: then

  } // eslint: sender

} // eslint: Class

module.exports = Client;
