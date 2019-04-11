const _ = require('lodash');

const WebServer = require('./App/Web/Server.js');
const Config = require('./App/Config/Config.js');

module.exports = class ExcerciseTrackerServer{
    constructor(overrideConfig){
        if(!_.isUndefined(overrideConfig)){
            this.Config = overrideConfig;
        }
        else{
            this.Config = new Config();
        }
        this.WebServer = new WebServer(this.Config.Web.ListenOnPort, this.Config.DistanceSensor);
    }
}