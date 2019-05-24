const req = require('./wrapper')
const util = require('util')

const debug = util.debuglog('zp:api')

class Zabbix {
  /**
   * Create an instance to make Zabbix API calls.
   * @param {object} opts
   * @property {string} url - The URL of the Zabbix API endpoint.
   * @property {string} user - The login name for authentication.
   * @property {string} password - The password for authentication.
   * @property {object} options - Any Nodejs HTTP request supported options.
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
   *
   * @param {string} method - tbd
   * @param {object|array} params - tbd
   * @returns {object|string} abc
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

  async login () {
    try {
      const result = await this.request('user.login', {
        user: this.user,
        password: this.password
      })
      this.auth = result
      return result
    } catch (error) {
      throw error
    }
  }

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
