// This worked on my local machine but when I tried to use this code on the raspberry pi it stopped working
// I was attempting to use this for conditional compile so I could run this on my local machine without having
// The distance sensor hardware and thus the pigpio driver would fail to load
// if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'development'){
//     const Gpio = require('pigpio').Gpio;
// }

const Gpio = require('pigpio').Gpio;
const _ = require('lodash');

module.exports = class DistanceSensor{
    constructor(config){
        this.Config = config;
        // Only use the hardware if you have the pigpio library defined otherwise it's in a test mode
        if(typeof Gpio !== 'undefined'){
            this.Trigger = new Gpio(this.Config.TriggerPinNum, {mode: Gpio.OUTPUT});
            this.Echo = new Gpio(this.Config.EchoPinNum, {mode: Gpio.INPUT, alert: true});
        }
        this.MICROSECDONDS_PER_CM = 1e6/34321;
        this.DistanceHistory = [];
    }

    Start(){
        // Only use the hardware if you have the pigpio library defined otherwise it's in a test mode
        if(typeof Gpio !== 'undefined'){
            // Note that this code is derived from: https://github.com/fivdi/pigpio
            // Make sure trigger is low
            this.Trigger.digitalWrite(0); 

            // The handle trigger function will handle calculating the distance from the sensor and
            // saving it to memory
            this.HandleTriggerFunc = _.bind(this.HandleTrigger, this);
            
            // Setup the function to call on the echo pin seeing the alert event occur

            this.Echo.on('alert', this.HandleTriggerFunc)
            
            // Trigger a distance measurement once per second
            setInterval(_.bind(function(){
                // Set trigger high for 10 microseconds
                this.Trigger.trigger(10, 1); 
            }, this), 1000);
        }
        else{
            // Otherwise we're in a testing mode, invoke the test function to simulate readings
            setInterval(_.bind(this.Config.Test.TestFunction, this), this.Config.Test.RefreshMinutes * 60 * 1000);
        }
    }

    SetCurrentDistance(distance){
        // When I was testing the distance sensor I saw intermittant distances that didn't make much sense, I
        // figured these were just errant reading from the sensor, so this function keeps track of the last
        // X readings so we can disregard the current reading if necessary

        // Keep around a history of the last couple of readings
        if(this.DistanceHistory.length > this.Config.MaxHistoryLength){
            this.DistanceHistory.pop();
        }

        // Push the current reading onto the history list
        this.DistanceHistory.push(distance);

        // Check if the current reading is valid if it is then use is
        if(this.IsValidDistance(distance)){
            this.CurrentDistance = distance;
            return;
        }

        // The current reading isn't valid, go through the history and find the latest valid
        // reading and use that instead
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
        // Note that this code is derived from: https://github.com/fivdi/pigpio
        if (level == 1) {
            this.StartTick = tick;
          } else {
            const endTick = tick;
            // Unsigned 32 bit arithmetic
            const diff = (endTick >> 0) - (this.StartTick >> 0); 
            this.SetCurrentDistance(diff / 2 / this.MICROSECDONDS_PER_CM);
          }      
    }
}