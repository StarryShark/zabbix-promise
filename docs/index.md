# zabbix-promise

* * *

## Class: Zabbix
Zabbix API client class.

**Parameters**

**url**: `String`, Zabbix Server API endpoint.

**user**: `String`, login name.

**password**: `String`, login password.

### Zabbix.login()

Log in and obtain an authentication token.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.createHost(params)

Create new hosts.

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.getHost(params)

Retrieve hosts according to the given parameters.

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.updateHost(params)

Update existing hosts.

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.deleteHost(params)

Delete hosts

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.massAddHost(params)

Simultaneously add multiple related objects to all the given hosts.

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.massUpdateHost(params)

Simultaneously replace or remove related objects and update properties on
multiple hosts.

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

### Zabbix.massRemoveHost(params)

Remove related objects from multiple hosts

**Parameters**

**params**: `Object`, parameters that will be passed to the API method.

**Returns**: `Promise`, a promise which resolves to the http response.

* * *

*Copyright (c) 2016 Sumit Goel*

**Author:** Sumit Goel &lt;sumit@goel.pw&gt;

**License:** MIT

**Overview:** Interact with the Zabbix API using `zabbix-promise` and ES2015
native promises.
