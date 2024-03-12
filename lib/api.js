const req = require('./wrapper')
const util = require('util')

const debug = util.debuglog('zp:api')

/**
 * Zabbix class represents the Zabbix API Client to make JSON-RPC 2.0 protocol
 * compliant HTTP POST requests. You instantiate a class with an object that
 * includes the required properties listed below, and then you should call the
 * login method first to get the valid authentication token. Now you are ready
 * to make other Zabbix API calls and don't forget to call the logout method
 * when you are done.
 */
class Zabbix {
  /**
   * The constructor creates an instance of Zabbix class.
   *
   * @param {object} opts - An object contains the details about Zabbix API
   *  server like url, username, password and an optional object for any other
   *  Node.js HTTP options the user may want to send with the request.
   * @property {string} url - The URL of the Zabbix API endpoint.
   * @property {string} user - The login name for authentication.
   * @property {string} password - The password for authentication.
   * @property {object} [options] - Any Nodejs HTTP request supported options.
   *
   * @example
   * new Zabbix({
   *   url: 'https://127.0.0.1:8443/api_jsonrpc.php',
   *   user: 'Admin',
   *   password: 'zabbix',
   *   options: {
   *     rejectUnauthorized: false
   *   }
   * })
   */
  constructor (opts) {
    this.url = opts.url
    this.user = opts.user
    this.password = opts.password
    this.options = opts.options || {}
    this.auth = null

    debug('Constructor options: %o', opts)
  }

  /**
   * A request method to make Zabbix API calls.
   *
   * @param {string} method - the Zabbix API method being called.
   * @param {object|array} params - The parameters that will be passed to the
   *  Zabbix API method.
   *
   * @returns {Promise} - a promise which resolves to the http response from the
   *  Zabbix server of string, object or array type.
   *
   * @example
   * Zabbix.request('host.get', { limit: 1 })
   */
  async request (method, params) {
    try {
      const res = await req.post({
        url: this.url,
        auth: this.auth,
        options: this.options,
        method,
        params
      })
      debug('API Request response: %o', res)
      if (res.result) {
        return res.result
      } else {
        throw JSON.stringify(res)
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * A login method to authenticate with Zabbix.
   *
   * @returns {Promise} - a promise which resolves to the http response from the
   *  Zabbix server of string type authentication token.
   *
   * @example
   * Zabbix.login()
   */
  async login () {
    try {
      const result = await this.request('user.login', {
        username: this.user,
        password: this.password
      })
      this.auth = result
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * A logout method to close the Zabbix server session.
   *
   * @returns {Promise} - a promise which resolves to the http response from the
   *  Zabbix server of boolean truthy value.
   *
   * @example
   * Zabbix.logout()
   */
  async logout () {
    try {
      const result = await this.request('user.logout', [])
      this.auth = null
      return result
    } catch (error) {
      throw error
    } finally {
      this.auth = null
    }
  }
}

module.exports = Zabbix
