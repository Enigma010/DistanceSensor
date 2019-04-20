const express = require('express');
const bodyParser = require('body-parser');
const DistanceSensorController = require('../Web/Controller/DistanceSensorController.js');

module.exports = class Server{
    constructor(listenOnPort, distanceSensorConfig){

        // Setup the Web Server
        this.ListenOnPort = listenOnPort;
        this.Server = express();
        this.Server.use(bodyParser.json());
        this.Listener = this.Server.listen(this.ListenOnPort);
        this.Controllers = [];

        // Save off the configuration just in case
        this.DistanceSensorConfig = distanceSensorConfig;

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