const req = require('./wrapper');
const debug = require('debug')('api');

class Zabbix {

  /**
   * Zabbix API client class.
   *
   * @param {string} url - Zabbix API endpoint.
   * @param {string} user - login name.
   * @param {string} password - login password.
   * @param {Object} options - specify request options.
   * Link: https://github.com/request/request#requestoptions-callback
   */
  constructor(url, user, password, options = {}) {

    this.url = url;
    this.user = user;
    this.password = password;
    this.options = options;
    this.rpcid = 0;
    this.authid = null;
  } // eslint: constructor

  request(method, params) {

    const opts = {
      'id': this.rpcid += 1,
      'uri': this.url,
      'auth': this.authid,
      'options': this.options,
      method,
      params
    };

    return req.post(opts).then(value => {

      debug('HTTP response: %o', value);

      if (!Object.prototype.hasOwnProperty.call(value, 'result')) {

        throw value;
      }

      return value.result;
    });
  } // eslint: request

  /**
   * This method allows to log in to the API and generate an authentication
   * token for subsequent API calls.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  login() {

    return this.request('user.login', {
      'user': this.user,
      'password': this.password
    }).then(value => {

      this.authid = value;
      return value;
    });
  } // eslint: login

  /**
   * This method allows to log out of the API and invalidates the current
   * authentication token.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  logout() {

    return this.request('user.logout', []).then(value => {

      this.authid = null;
      return value;
    });
  } // eslint: logout

} // eslint: class

module.exports = Zabbix;