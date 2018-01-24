/**
 * Dependencies
 */
const {spawn} = require('child_process');
const debug = require('debug')('utils');
const Zabbix = require('./api');

/**
 * Extending Zabbix API Client with helper methods
 */
class Client extends Zabbix {

  /**
   * @param {Object} options - zabbix_sender options
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  static sender (options) {
    return new Promise((resolve, reject) => {
      options.path = options.path || 'zabbix_sender';
      options.port = options.port || '10051';
      options.server = options.server || reject(new Error('Please provide ' +
        'zabbix server or proxy name.'));
      options.host = options.host || reject(new Error('Please provide the ' +
        'zabbix host name as registered in Zabbix frontend.'));
      options.values = options.values || reject(new Error('Specify values ' +
        'each line contains whitespace delimited: - <key> <value>'));

      resolve(options);
    }).then((val) => {
      const {path, server, port, host, values} = val;

      return new Promise((resolve, reject) => {
        debug('zabbix_sender options: %O', val);

        let stdout = '';
        let stderr = '';

        // eslint-disable-next-line array-element-newline, max-len
        const cmd = spawn(path, ['-z', server, '-p', port, '-s', host, '-r', '-i', '-']);

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
      }); // eslint: then return promise
    }); // eslint: promise then
  } // eslint: sender
} // eslint: Class

module.exports = Client;
