/**
 * Dependencies
 */
const req = require('./lib/wrapper');

/**
 * Variables
 */
const HTTPOK = 200;
const INDEX = 0;

class Client {

  /**
   * Create and initialize client class object.
   *
   * @param {string} url - Zabbix API endpoint.
   * @param {string} user - login name.
   * @param {string} password - login password.
   */
  constructor (url, user, password) {

    this.url = url;
    this.user = user;
    this.password = password;
    this.rpcid = 0;
    this.authid = null;

  }

  static reqValidation (value) {

    let retValue = value;
    const result = value.body.result;

    if (value.statusCode === HTTPOK && result) {

      if (Array.isArray(result) && result.length > INDEX) {

        retValue = result;

      } else if (typeof result === 'string') {

        retValue = result;

      } else {

        retValue = value;

      }

    }

    return retValue;

  }

  /**
   * Log in and obtain an authentication token.
   *
   * @returns {Promise} - A promise which resolves to the http response.
   */
  login () {

    const opts = {
      'id': this.rpcid += 1,
      'uri': this.url,
      'auth': this.authid,
      'method': 'user.login',
      'params': {
        'user': this.user,
        'password': this.password
      }
    };

    return req.post(opts)
            .then((value) => this.constructor.reqValidation(value))
            .then((value) => {

              this.authid = value;

              return value;

            });

  }

  /**
   * HTTP POST request to Zabbix server for given method and parameters.
   *
   * @param {string} method - the API method to be called.
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} - A promise which resolves to the http response.
   */
  request (method, params) {

    const opts = {
      'id': this.rpcid += 1,
      'uri': this.url,
      'auth': this.authid,
      method,
      params
    };

    return req.post(opts)
            .then((value) => this.constructor.reqValidation(value));

  }
}

module.exports = Client;
