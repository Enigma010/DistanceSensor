const _ = require('lodash');
const MqttClient = require('../Mqtt/Client.js');

module.exports = class Config{
    constructor(webListenOnPort, triggerPinNum, echoPinNum, maxDistance, minDistance, maxHistoryLength, 
        testRefreshMinutes, testFunction, mqttUrl){

        // This section either uses the values passed in or sets them to default values
        if(_.isUndefined(webListenOnPort) || _.isNull(webListenOnPort)){
            webListenOnPort = 3000;
        }
        if(_.isUndefined(triggerPinNum) || _.isNull(triggerPinNum)){
            triggerPinNum = 18;
        }
        if(_.isUndefined(echoPinNum) || _.isNull(echoPinNum)){
            echoPinNum = 24;
        }
        if(_.isUndefined(testRefreshMinutes) || _.isNull(testRefreshMinutes)){
            testRefreshMinutes = 1;
        }
        if(_.isUndefined(testFunction) || typeof testFunction !== 'function'){
            testFunction = function(){
                this.SetCurrentDistance(Math.random() * this.Config.MaxDistance);
            }
        }
        if(_.isUndefined(maxDistance) || _.isNull(maxDistance)){
            maxDistance = 2900;
        }
        if(_.isUndefined(minDistance) || _.isNull(minDistance)){
            minDistance = 0;
        }
        if(_.isUndefined(maxHistoryLength) || _.isNull(maxHistoryLength)){
            maxHistoryLength = 3;
        }
        if(_.isUndefined(mqttUrl) || _.isNull(mqttUrl)){
            mqttUrl = 'mqtt://xxx.xxx.xxx.xxx:1883';
        }
        // end section of setting defaults

        // Construct the configuration objects based on the values
        this.Web = {
            ListenOnPort: webListenOnPort
        };

        let mqttClient = new MqttClient(mqttUrl);

        this.MqttClient = mqttClient;
        this.DistanceSensor = {
            TriggerPinNum: triggerPinNum,
            EchoPinNum: echoPinNum,
            MaxDistance: maxDistance,
            MinDistance: minDistance,
            MaxHistoryLength: maxHistoryLength,
            Test: {
                RefreshMinutes: testRefreshMinutes,
                TestFunction: testFunction
            },
            DistanceChanged: _.bind(mqttClient.DistanceChanged, mqttClient)
        };
    }
}