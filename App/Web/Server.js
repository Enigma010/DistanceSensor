const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const DistanceSensorController = require('../Web/Controller/DistanceSensorController.js');
const MqttClient = require('../Mqtt/Client.js');

module.exports = class Server{
    constructor(listenOnPort, sensorConfig){

        // Setup the Web Server
        this.ListenOnPort = listenOnPort;
        this.Server = express();
        this.Server.use(bodyParser.json());
        this.Listener = this.Server.listen(this.ListenOnPort);
        this.Controllers = [];

        // Save off the configuration just in case
        this.DistanceSensorConfig = sensorConfig;

        if(!_.isUndefined(sensorConfig) && !_.isUndefined(sensorConfig.Mqtt) && !_.isUndefined(sensorConfig.Mqtt.Url)
        && sensorConfig.Mqtt.Url){
            sensorConfig.Mqtt.Client = new MqttClient(sensorConfig.Mqtt.Url, sensorConfig.Mqtt.Options, sensorConfig.Mqtt.ChannelPrefix);
            sensorConfig.DistanceChanged = _.bind(sensorConfig.Mqtt.Client.DistanceChanged, sensorConfig.Mqtt.Client);
        }

        // Finish setup
        this.Setup();
    }

    Setup(){
        // Setup all the controllers
        this.SetupControllers();
    }
    
    SetupControllers(){
        // Setup the distance controller
        this.Controllers.push(new DistanceSensorController(this.Server, this.DistanceSensorConfig));
    }
}