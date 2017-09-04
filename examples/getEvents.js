/* eslint-disable no-process-env */

const Zabbix = require('../index');

const whiteSpaceCount = 2;
const timeFrom = Date.parse('Mar 1 2017 00:00:00 GMT') / 1000;
const timeTill = Date.parse('Mar 31 2017 23:59:59 GMT') / 1000;
const event = {}; // eslint: will contain ack and unack event count
const getEventParams = {
  'countOutput': true,
  'time_from': timeFrom,
  'time_till': timeTill,
  'acknowledged': false,
  'source': 0, // eslint: event created by a trigger
  'value': 1 // eslint: problem events only
};

const zabbix = new Zabbix(
  'https://zabbix/zabbix/api_jsonrpc.php',
  process.env.ZABBIX_USER,
  process.env.ZABBIX_PASSWORD,
  false // eslint: https rejectUnauthorized boolean
);


zabbix.login()
  .then(() => zabbix.request('event.get', getEventParams))
  .then((value) => {

    event.unack = value;
    getEventParams.acknowledged = true;

    return zabbix.request('event.get', getEventParams);

  })
  .then((value) => {

    event.ack = value;
    console.log(JSON.stringify(event, null, whiteSpaceCount));

  })
  .then(() => zabbix.logout())
  .catch((reason) =>
    console.log(JSON.stringify(reason, null, whiteSpaceCount)));
