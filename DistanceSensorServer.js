const _ = require('lodash');

const WebServer = require('./App/Web/Server.js');
const Config = require('./App/Config/Config.js');

module.exports = class DistanceSensorServer{
    constructor(config){
        this.Config = config;
           
        // Setup the web server and distance sensor
        this.WebServer = new WebServer(this.Config.Web.ListenOnPort, this.Config.DistanceSensor);
    }
}