const _ = require('lodash');

module.exports = class Config{
    constructor(webListenOnPort, triggerPinNum, echoPinNum){
        if(_.isUndefined(webListenOnPort) || _.isNull(webListenOnPort)){
            webListenOnPort = 3000;
        }
        if(_.isUndefined(triggerPinNum) || _.isNull(triggerPinNum)){
            triggerPinNum = 18;
        }
        if(_.isUndefined(echoPinNum) || _.isNull(echoPinNum)){
            echoPinNum = 24;
        }
        this.Web = {
            ListenOnPort: webListenOnPort
        };
        this.DistanceSensor = {
            TriggerPinNum: triggerPinNum,
            EchoPinNum: echoPinNum
        };
    }
}