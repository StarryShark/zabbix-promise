/**
 * Dependencies
 */
const debug = require('debug')('api')
const req = require('./wrapper')

/**
 * Zabbix API Client Object
 */
class Zabbix {
  /**
   * @param {String} url - Zabbix API endpoint
   * @param {String} user - Zabbix login name
   * @param {String} password - Zabbix login password
   * @param {Object} options - HTTP request options
   */
  constructor (url, user, password, options = {}) {
    this.url = url
    this.user = user
    this.password = password
    this.options = options
    this.rpcid = 0
    this.authid = null
  } // eslint: constructor

  /**
   * @param {String} method - Zabbix API method
   * @param {String} params - Parameters for the method call
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  request (method, params) {
    const opts = {
      'id': this.rpcid += 1,
      'uri': this.url,
      'auth': this.authid,
      'options': this.options,
      method,
      params
    }

    return req.post(opts).then((value) => {
      debug('HTTP response: %o', value)

      if (!Object.prototype.hasOwnProperty.call(value, 'result')) {
        throw new Error(value)
      }

      return value.result
    })
  } // eslint: request

  /**
   * This method allows to log in to the API and generate an authentication
   * token for subsequent API calls.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  login () {
    return this.request('user.login', {
      'user': this.user,
      'password': this.password
    }).then((value) => {
      this.authid = value
      return value
    })
  } // eslint: login

  /**
   * This method allows to log out of the API and invalidates the current
   * authentication token.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  logout () {
    return this.request('user.logout', []).then((value) => {
      this.authid = null
      return value
    })
  } // eslint: logout
} // eslint: class

module.exports = Zabbix
