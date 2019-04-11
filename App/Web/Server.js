const express = require('express');
const bodyParser = require('body-parser');
const DistanceSensorController = require('../Web/Controller/DistanceSensorController.js');

module.exports = class Server{
    constructor(listenOnPort, distanceSensorConfig){
        this.ListenOnPort = listenOnPort;
        this.Server = express();
        this.Server.use(bodyParser.json());
        this.Listener = this.Server.listen(this.ListenOnPort);
        this.Controllers = [];
        this.DistanceSensorConfig = distanceSensorConfig;
        this.Setup();
    }

    Setup(){
        this.SetupControllers();
    }
    
    SetupControllers(){
        this.Controllers.push(new DistanceSensorController(this.Server, this.DistanceSensorConfig));
    }
}