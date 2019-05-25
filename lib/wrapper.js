const http = require('http')
const https = require('https')
const { URL } = require('url')
const util = require('util')

const debug = util.debuglog('zp:wrapper')

module.exports = {
  /**
   * @param {object} opts
   * @property {string} url
   * @property {string} auth
   * @property {string} method
   * @property {(object|Array)} params
   * @property {object} options
   */
  post: async (opts) => {
    try {
      // Creates a new URL object by parsing the input
      const url = new URL(opts.url)
      debug('Request URL: %o', url)

      // Use http or https module based on the input URL
      let client = http
      if (url.protocol === 'https:') {
        client = https
      }

      // Include or overwrite the user supplied HTTP request options.
      const options = Object.assign({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, opts.options)
      debug('Request options: %o', options)

      // Stringify the JSON body to write to HTTP POST request.
      const body = JSON.stringify({
        jsonrpc: '2.0',
        id: String(Math.random()),
        auth: opts.auth,
        method: opts.method,
        params: opts.params
      })
      debug('Request body: %o', body)

      return new Promise((resolve, reject) => {
        const req = client.request(options, (res) => {
          const { statusCode } = res
          const contentType = res.headers['content-type']

          debug('Response status code: %i', statusCode)
          debug('Response status message: %s', res.statusMessage)
          debug('Response headers: %o', res.headers)

          /**
           * Check the response headers for status code and content type.
           * If it's not 200 and application/json respectively then reject the
           * promise and that will return the error message.
           */
          let error = ''
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                              `Expected application/json but received ${contentType}`)
          }

          if (error) {
            /**
             * We are calling .resume() to consume the data from response.
             * Because until the data is read it will consume memory that can
             * eventually lead to a 'process out of memory' error. Read more at:
             * https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_clientrequest
             */
            res.resume()
            reject(error)
          }

          res.setEncoding('utf8')
          let rawData = ''
          res.on('data', (chunk) => { rawData = rawData + chunk })
          res.on('end', () => {
            debug('Response body: %o', rawData)
            resolve(JSON.parse(rawData))
          })
        })

        req.on('error', (error) => {
          reject(error)
        })

        req.write(body)
        req.end()
      })
    } catch (error) {
      throw error
    }
  }
}
