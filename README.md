# DistanceSensor
This is an implementation of retrieving the distance measurement of a HC-SR04 distance sensor via HTTP and optionally publishing to MQTT.  The circuit for the HC-SR04 was taken from [pigpio](https://www.npmjs.com/package/pigpio#measure-distance-with-a-hc-sr04-ultrasonic-sensor). Once you have the hardware you can run the distance measurement retrieval program either via HTTP or via HTTP and MQTT.

## Parameters
When you start the distance measurement retrieval program you can supply it various parameters. The syntax for a parameter is the following:

--parameterName parameterValue

All the parameters have a default value if not specified. There are certain parameters that are required for the program to start, if these parameters are not specified it will use the default values. An example of this is echo and trigger pin numbers.  If the parameter is not required and not specified the option will be turned off. An example of this is the MQTT URL.

## Retrieving Distance Measurement via HTTP
The following command is used to start the retrieval via HTTP:

```
sudo node index.js --webListenOnPort webListenOnPort --triggerPinNum triggerPinNum --echoPinNum echoPinNum &
```

Note you need to supply values for the following:

Parameter|Description|Required|Default
---------|-----------|--------|-------
--webListenOnPort|The socket number to use for the web server|Yes|3000
--triggerPinNum|The GPIO pin number for the HC-SR04 trigger pin|Yes|23
--echoPinNum|The GPIO pin number for the HC-SR04 echo pin|Yes|24

To access the distance go to the URL

```
http://distanceSensorServer:webListenOnPort/DistanceSensor/read
```

Note that you'll need to change distanceSensorServer to the server name or IP of the server you started the distance measurement retrieval program and for the webListenOnPort put in the port for the web server.  The response that you receive will be in JSON and will have the following format:

```javascript
{"Response":{"Error":{}},"Data":18.704945}
```

Note that the Data value is the distance in centimeters.

## Retrieving Distance Measurement via HTTP and MQTT
The following command is used to start the retrieval via HTTP and publish the value to MQTT:

```
sudo node index.js --webListenOnPort webListenOnPort --mqttUrl "mqttUrl" --triggerPinNum triggerPinNum --echoPinNum echoPinNum &
```

Note you need to supply values for the following:

Parameter|Description|Required|Default
---------|-----------|--------|-------
--webListenOnPort|The socket number to use for the web server|Yes|3000
--mqttUrl|The URL for the MQTT server, example mqtt://mqttServer note that you can also specify the port like mqtt://mqttServer:mqttPort. Note that if you don't specify the URL MQTT will be disabled|No|
--triggerPinNum|The GPIO pin number for the HC-SR04 trigger pin|Yes|23
--echoPinNum|The GPIO pin number for the HC-SR04 echo pin|Yes|24

To access the distance go to the URL

```
http://distanceSensorServer:webListenOnPort/DistanceSensor/read
```

Note that you'll need to change distanceSensorServer to the server name or IP of the server you started the distance measurement retrieval program and for the webListenOnPort put in the port for the web server.  The response that you receive will be in JSON and will have the following format:

```javascript
{"Response":{"Error":{}},"Data":18.704945}
```

Note that the Data value is the distance in centimeters.

MQTT will publish the distance in centimeters to the following channel:

/Distance/

## Complete Parameter List
Here is a complete list of the parameters that can be specified:

Parameter|Description|Required|Default
---------|-----------|--------|-------
--webListenOnPort|The socket number to use for the web server|Yes|3000
--triggerPinNum|The GPIO pin number for the HC-SR04 trigger pin|Yes|23
--echoPinNum|The GPIO pin number for the HC-SR04 echo pin|Yes|24
--maxDistance|The maximum distance that the sensor can read, if the distance read if more than this value the distance returned will be the last valid distance read|Yes|2900
--minDistance|The minimum distance that the sensor can read, if the distance read is less than this value the distance returned will be the last valid distance read|Yes|0
--maxHistoryLength|The number of historical distances to keep around in internal memory|Yes|3
--distanceChangedInvokeInterval|The number of milliseconds to wait before publishing the distance to the MQTT channel|No|60000
--mqttUrl|The URL for the MQTT server, example mqtt://mqttServer note that you can also specify the port like mqtt://mqttServer:mqttPort. Note that if you don't specify the URL MQTT will be disabled|No|
--mqttOptions|Options to pass into the MQTT client, JSON format. See [Mqtt.js](https://www.npmjs.com/package/mqtt) for details.|No|
--mqttChannelPrefix|A value to put in front of the MQTT channel that the distance published to. For example supplying _*Foo/*_ will publish the distance to _*Foo/Distance*_|No|
--loggingDir|A relative or absolute path to put log files in|No|