# Zabbix API Client

Zabbix is an open source monitoring software that can monitor pretty much everything like networks, servers, applications, etc. You may learn more about Zabbix at [www.zabbix.com](https://www.zabbix.com/).

**Zabbix-promise** is a JavaScript package for Node.js runtime environment to interact with Zabbix APIs. The package is written to support JavaScript Promise and Async/await interfaces. Zabbix-promise implements Zabbix sender protocol in pure JavaScript code, and there are no other package dependencies, just the Node.js runtime.

The latest version of zabbix-promise supports all currently maintained Node versions, see [Node Release Schedule](https://github.com/nodejs/Release#release-schedule) and all currently supported Zabbix releases, see [Zabbix Life Cycle & Release Policy](https://www.zabbix.com/life_cycle_and_release_policy).

## Install

```js
$ npm install zabbix-promise --save
```

## Usage

Please check the examples below to get started.

- [getHost](examples/getHost.js)
- [createHost](examples/createHost.js)
- [zabbixSender](examples/zabbixSender.js)

## Debugging

Zabbix-promsie uses [`debuglog`](https://nodejs.org/dist/latest/docs/api/util.html#util_util_debuglog_section), so just run with environmental variable `NODE_DEBUG` set to `zp*`.

```js
$ NODE_DEBUG=zp* node getHost.js
```

## Contributing

👋Thanks for thinking about contributing to zabbix-promise! There are a few ways you may contribute to the project.

1. Use the package in your projects and report any bugs you may find by filing issues.
2. Submit examples to cover the Zabbix APIs that are not in examples already by sending pull request.
3. Submit test cases to cover all or most of the Zabbix APIs by sending pull request.

## License

[MIT](LICENSE)

Copyright (c) 2016-2019 Sumit Goel.
