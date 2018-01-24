/**
 * Dependencies
 */
const rp = require('request-promise-native');
const debug = require('debug')('wrapper');

module.exports = {

  /**
   * Wrapper around request-promise-native package for POST requests.
   *
   * @param {Object} opts - object with authentication token, method and
   *  parameters properties
   * @returns {Promise} - A promise which resolves to the resource created.
   */
  'post': (opts) => {
    let options = {
      'uri': opts.uri,
      'json': true,
      'gzip': true,
      'body': {
        'jsonrpc': '2.0',
        'id': opts.id,
        'auth': opts.auth,
        'method': opts.method,
        'params': opts.params
      }
    };

    options = Object.assign(options, opts.options);

    debug('HTTP POST Options: %o', options);

    return rp.post(options);
  }
};
