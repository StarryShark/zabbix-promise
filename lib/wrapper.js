const rp = require('request-promise-native');

module.exports = {

  /**
   * Wrapper around request-promise-native package for POST requests.
   *
   * @param {Object} opts - object with authentication token, method and
   *                      parameters properties
   * @returns {Promise} - A promise which resolves to the resource created.
   */
  'post': (opts) => {

    const options = {
      'method': 'POST',
      'uri': opts.uri,
      'json': true,
      'simple': false,
      'resolveWithFullResponse': true,
      'body': {
        'jsonrpc': '2.0',
        'id': opts.id,
        'auth': opts.auth,
        'method': opts.method,
        'params': opts.params
      }
    };

    return rp.post(options);

  }
};
