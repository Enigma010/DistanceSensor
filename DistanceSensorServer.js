const _ = require('lodash');

const WebServer = require('./App/Web/Server.js');
const Config = require('./App/Config/Config.js');

module.exports = class DistanceSensorServer{
    constructor(overrideConfig){
        // If a config is passed in use it otherwise load the default
        if(!_.isUndefined(overrideConfig)){
            this.Config = overrideConfig;
        }
        else{
            this.Config = new Config();
        }
        
        // Setup the web server and distance sensor
        this.WebServer = new WebServer(this.Config.Web.ListenOnPort, this.Config.DistanceSensor);
    }
}