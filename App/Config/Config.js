const _ = require('lodash');
const winston = require('winston');
const fs = require('fs-extra')
require('winston-daily-rotate-file');

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
            DistanceChangedInvokeInterval: argv.distanceChangedInvokeInterval,
            Mqtt: {
                Url: argv.mqttUrl,
                Options: mqttOptions,
                ChannelPrefix: argv.mqttChannelPrefix
            }
        };

        // This section sets up a simple test function
        this.DistanceSensor.Test = {};
        this.DistanceSensor.Test.RefreshSeconds = argv.testRefreshSeconds;
        this.DistanceSensor.Test.TestFunction = function(){
            return 100 * Math.random();
        };
        // end test function setup

        // Setup logging
        var transportsArray = [];
        transportsArray.push(new winston.transports.Console());
        if(argv.loggingDir){
            fs.ensureDirSync(argv.loggingDir);
            transportsArray.push(new (winston.transports.DailyRotateFile)({
                filename: 'DistanceSensor-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                dirname: argv.loggingDir
              }));
        }

        this.Logger = winston.createLogger({
            level: 'info',
            transports: transportsArray
          });
        this.DistanceSensor.Logger = this.Logger;
        // end setup logging

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
        if(_.isUndefined(this.DistanceSensor.Test.RefreshSeconds) || _.isNull(this.DistanceSensor.Test.RefreshSeconds)){
            this.DistanceSensor.Test.RefreshSeconds = 60;
        }
        // end section of setting defaults
    }
}