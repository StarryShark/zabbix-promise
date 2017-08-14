const req = require('./wrapper');

const HTTPOK = 200;

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

  static reqValidation(value) {

    return new Promise((resolve, reject) => {

      const { result } = value.body;

      if (value.statusCode === HTTPOK && result) {

        resolve(result);
      } else {

        reject(result);
      }
    });
  } // eslint: reqValidation

  request(method, params) {

    const opts = {
      'id': this.rpcid += 1,
      'uri': this.url,
      'auth': this.authid,
      'options': this.options,
      method,
      params
    };

    return req.post(opts).then(value => this.constructor.reqValidation(value));
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

      if (typeof value === 'string' || value instanceof String) {

        this.authid = value;
        return value;
      }

      throw value;
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

      if (typeof value === 'boolean' && value) {

        this.authid = null;
        return value;
      }

      throw value;
    });
  } // eslint: logout

} // eslint: class

module.exports = Zabbix;