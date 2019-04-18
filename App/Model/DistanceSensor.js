if(typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV !== 'development'){
    const Gpio = require('pigpio').Gpio;
}
const _ = require('lodash');

module.exports = class DistanceSensor{
    constructor(config){
        this.Config = config;
        if(typeof Gpio !== 'undefined'){
            this.Trigger = new Gpio(this.Config.TriggerPinNum, {mode: Gpio.OUTPUT});
            this.Echo = new Gpio(this.Config.EchoPinNum, {mode: Gpio.INPUT, alert: true});
        }
        this.MICROSECDONDS_PER_CM = 1e6/34321;
        this.DistanceHistory = [];
    }

    Start(){
        if(typeof Gpio !== 'undefined'){
            this.Trigger.digitalWrite(0); // Make sure trigger is low
            this.HandleTriggerFunc = _.bind(this.HandleTrigger, this);
            this.HandleTriggerFunc();
            // Trigger a distance measurement once per second
            setInterval(_.bind(function(){
                this.Trigger.trigger(10, 1); // Set trigger high for 10 microseconds
            }, this), 1000);
        }
        else{
            setInterval(_.bind(this.Config.Test.TestFunction, this), this.Config.Test.RefreshMinutes * 60 * 1000);
        }
    }

    SetCurrentDistance(distance){
        if(this.DistanceHistory.length > this.Config.MaxHistoryLength){
            this.DistanceHistory.pop();
        }
        this.DistanceHistory.push(distance);

        if(this.IsValidDistance(distance)){
            this.CurrentDistance = distance;
            return;
        }

        _.forEach(this.DistanceHistory, _.bind(function(checkDistance){
            if(this.IsValidDistance(checkDistance)){
                this.CurrentDistance = checkDistance;
            }
        }, this));
    }

    IsValidDistance(distance){
        return distance >= this.Config.MinDistance && distance <= this.Config.MaxDistance
    }

    HandleTrigger(level, tick){
        if (level == 1) {
            this.StartTick = tick;
          } else {
            const endTick = tick;
            const diff = (endTick >> 0) - (this.StartTick >> 0); // Unsigned 32 bit arithmetic
            this.SetCurrentDistance(diff / 2 / this.MICROSECDONDS_PER_CM);
          }      
    }
}