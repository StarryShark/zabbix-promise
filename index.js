/**
 * @overview Interact with the Zabbix API using `zabbix-promise` and ES2015
 * native promises.
 * @copyright Copyright (c) 2016 Sumit Goel
 * @license MIT
 * @author Sumit Goel <sumit@goel.pw>
 */

const req = require('./lib/wrapper');

const HTTPOK = 200;
const INDEX = 0;


class Zabbix {

  /**
   * Zabbix API client class.
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

  } // eslint: constructor

  static reqValidation (value) {

    return new Promise((resolve, reject) => {

      const result = value.body.result;

      if (value.statusCode === HTTPOK && result) {

        // eslint-disable-next-line no-extra-parens
        if ((Array.isArray(result) && result.length > INDEX) ||
          typeof result === 'string') {

          resolve(result);

        } else {

          reject(value);

        }

      } else {

        reject(value);

      }


    });


  } // eslint: reqValidation

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

  } // eslint: request

  /**
   * Log in and obtain an authentication token.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  login () {

    return this.request('user.login', {
      'user': this.user,
      'password': this.password
    })
      .then((value) => {

        this.authid = value;

        return value;

      });

  } // eslint: login

  // -------------------------------------
  // Functions for working with hosts.
  // -------------------------------------

  /**
   * Create new hosts.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  createHost (params) {

    return this.request('host.create', params);

  } // eslint: createHost

  /**
   * Retrieve hosts according to the given parameters.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  getHost (params) {

    return this.request('host.get', params);

  } // eslint: getHost

  /**
   * Update existing hosts.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  updateHost (params) {

    return this.request('host.update', params);

  } // eslint: updateHost

  /**
   * Delete hosts
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  deleteHost (params) {

    return this.request('host.delete', params);

  } // eslint: deleteHost

  /**
   * Simultaneously add multiple related objects to all the given hosts.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  massAddHost (params) {

    return this.request('host.massadd', params);

  } // eslint: massAddHost

  /**
   * Simultaneously replace or remove related objects and update properties on
   * multiple hosts.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  massUpdateHost (params) {

    return this.request('host.massupdate', params);

  } // eslint: massUpdateHost

  /**
   * Remove related objects from multiple hosts
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  massRemoveHost (params) {

    return this.request('host.massremove', params);

  } // eslint: massRemoveHost

  // -------------------------------------
  // Functions for working with items.
  // -------------------------------------

  /**
   * This method allows to create new items.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  createItem (params) {

    return this.request('item.create', params);

  } // eslint: createItem

  /**
   * This method allows to update existing items.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  updateItem (params) {

    return this.request('item.update', params);

  } // eslint: updateItem

  /**
   * The method allows to retrieve items according to the given parameters.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  getItem (params) {

    return this.request('item.get', params);

  } // eslint: getItem

  /**
   * This method allows to delete items.
   *
   * @param {Object} params - parameters that will be passed to the API method.
   * @returns {Promise} a promise which resolves to the http response.
   */
  deleteItem (params) {

    return this.request('item.delete', params);

  } // eslint: deleteItem

} // eslint: class

module.exports = Zabbix;
