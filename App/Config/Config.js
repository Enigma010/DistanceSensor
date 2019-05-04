const _ = require('lodash');
const MqttClient = require('../Mqtt/Client.js');

module.exports = class Config{
    constructor(argv){
        this.Web = {
            ListenOnPort: argv.webListenOnPort
        };

        // Parse MQTT optional parameters if supplied
        let mqttOptions = null;
        if(!_.isUndefined(argv.mqttOptions)){
            mqttOptions = JSON.parse(argv.mqttOptions);
        }

        // Take the parameters and put them in the distance sensor
        this.DistanceSensor = {
            TriggerPinNum: argv.triggerPinNum,
            EchoPinNum: argv.echoPinNum,
            MaxDistance: argv.maxDistance,
            MinDistance: argv.minDistance,
            MaxHistoryLength: argv.maxHistoryLength,
            Mqtt: {
                Url: argv.mqttUrl,
                Options: mqttOptions,
                ChannelPrefix: argv.mqttChannelPrefix
            }
        };

        // This section either uses the values passed in or sets them to default values
        if(_.isUndefined(this.Web.ListenOnPort) || _.isNull(this.Web.ListenOnPort)){
            this.Web.ListenOnPort = 3000;
        }
        if(_.isUndefined(this.DistanceSensor.TriggerPinNum) || _.isNull(this.DistanceSensor.TriggerPinNum)){
            this.DistanceSensor.TriggerPinNum = 18;
        }
        if(_.isUndefined(this.DistanceSensor.EchoPinNum) || _.isNull(this.DistanceSensor.EchoPinNum)){
            this.DistanceSensor.EchoPinNum = 24;
        }
        if(_.isUndefined(this.DistanceSensor.MaxDistance) || _.isNull(this.DistanceSensor.MaxDistance)){
            this.DistanceSensor.MaxDistance = 2900;
        }
        if(_.isUndefined(this.DistanceSensor.MinDistance) || _.isNull(this.DistanceSensor.MinDistance)){
            this.DistanceSensor.MinDistance = 0;
        }
        if(_.isUndefined(this.DistanceSensor.MaxHistoryLength) || _.isNull(this.DistanceSensor.MaxHistoryLength)){
            this.DistanceSensor.MaxHistoryLength = 3;
        }
        // end section of setting defaults
    }
}