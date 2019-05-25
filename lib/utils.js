const net = require('net')
const util = require('util')
const Zabbix = require('./api')

const debug = util.debuglog('zp:utils')

/**
 * Class extending Zabbix APIs to useful utility methods.
 * @extends Zabbix
 */
class Client extends Zabbix {
  /**
   * The sender method implements the Zabbix Sender protocol natively in
   * JavaScript. There is no need to authenticate with Zabbix to use sender
   * method. Just pass an object with server, host, key and value properties.
   *
   * @param {object} options - An object contains the payload to send to Zabbix
   *  sender.
   * @property {integer} [port] - Zabbix server port to receive sender traffic.
   *  Defaults to 10051.
   * @property {string} server - Zabbix server name or IP address
   * @property {string} host - Zabbix host as configured in frontend
   * @property {string} key - Zabbix host item key
   * @property {(string|number)} value - The value to send
   *
   * @example
   * Client.sender({
   *   server: '127.0.0.1',
   *   host: 'zabbix.host',
   *   key: 'item.test.key',
   *   value: 'Hey there!'
   * })
   */
  static async sender (options) {
    try {
      if (!options.server) throw new Error('"server" is missing')
      if (!options.host) throw new Error('"host" is missing')
      if (!options.key) throw new Error('"key" is missing')
      if (!options.value) throw new Error('"value" is missing')

      debug('Options received: %o', options)

      /**
       * Zabbix sender request message.
       * https://www.zabbix.com/documentation/4.0/manual/appendix/items/trapper
       */
      const payload = {
        request: 'sender data',
        data: [
          {
            host: options.host,
            key: options.key,
            value: options.value
          }
        ]
      }

      // Creates a new Buffer containing payload string.
      const payloadBuffer = Buffer.from(JSON.stringify(payload))

      /**
       * Returns the actual byte length of a string. This is not the same as
       * String.prototype.length since that returns the number of characters in
       * A string. When string is a Buffer, the actual byte length is returned.
       */
      const payloadByteLength = Buffer.byteLength(payloadBuffer)

      /*
      * Zabbix sender request and response messages must begin with header
      * And data length. Here is the link describing all the headers,
      * https://www.zabbix.com/documentation/4.0/manual/appendix/protocols/header_datalen
      *
      * The code below allocates a new Buffer of size 13 bytes and write the
      * header information.
      */
      const headerBuffer = Buffer.alloc(4 + 1 + 4 + 4)
      headerBuffer.write('ZBXD\x01')
      headerBuffer.writeUInt32LE(payloadByteLength, 5)
      headerBuffer.write('\x00\x00\x00\x00', 9)

      /*
      * Returns a new Buffer which is the result of concatenating the header and
      * Payload buffers.
      */
      const packet = Buffer.concat([headerBuffer, payloadBuffer])

      const serverResponse = await new Promise((resolve, reject) => {
        /**
         * Initiates connection to Zabbix server or proxy and sends the packet.
         */
        const client = net.connect({
          port: options.port || 10051,
          host: options.server
        }, () => {
          debug('Connected to server: %s', options.server)
          client.write(packet)
        })

        /**
         * Emitted when data is received. The argument data will be a Buffer or
         * String. By default, no encoding is assigned and stream data will be
         * returned as Buffer objects. Note that the data will be lost if there
         * is no listener when a Socket emits a 'data' event.
         */
        client.on('data', (data) => {
          debug('Server response raw: %s', data.toString())
          const jsonData = JSON.parse(data.slice(13).toString())
          debug('Server response parsed JSON: %j', jsonData)
          client.end()

          // Read the Zabbix server response and reject the promise with the
          // error message.
          const errorMessage = `${data.toString()}\n` + 'A few things to check,\n' +
            '- Double check the host and item key name in Zabbix\n' +
            '- Double check the item configuration e.g. item type, data type and etc.\n' +
            '- If using Zabbix proxy then ensure cache is updated.'
          const failed = jsonData.info.split(';')[1].slice(-1)
          if (failed !== '0') {
            reject(new Error(errorMessage))
          }
          resolve(jsonData)
        })

        /**
         * Emitted when an error occurs. The 'close' event will be called
         * directly following this event.
         */
        client.on('error', (error) => {
          debug('Server response: %o', error)
          reject(error)
        })

        /**
         * Emitted when the other end of the socket sends a FIN packet, thus
         * ending the readable side of the socket.
         */
        client.on('end', () => {
          debug('Connection closed.')
        })
      })

      return serverResponse
    } catch (error) {
      throw error
    }
  }
}

module.exports = Client
