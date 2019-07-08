const _ = require('lodash');

// This worked on my local machine but when I tried to use this code on the raspberry pi it stopped working
// I was attempting to use this for conditional compile so I could run this on my local machine without having
// The distance sensor hardware and thus the pigpio driver would fail to load
// if(_.isUndefined(process.env.NODE_ENV) || (!_.isUndefined(process.env.NODE_ENV) && process.env.NODE_ENV !== 'development')){
//     const Gpio = require('pigpio').Gpio;
// }
const Gpio = require('pigpio').Gpio;

module.exports = class DistanceSensor{
    constructor(config){
        this.Config = config;
        // Only use the hardware if you have the pigpio library defined otherwise it's in a test mode
        if(!this.InTestMode()){
            this.Trigger = new Gpio(this.Config.TriggerPinNum, {mode: Gpio.OUTPUT});
            this.Echo = new Gpio(this.Config.EchoPinNum, {mode: Gpio.INPUT, alert: true});
        }
        if(this.Config.Logger){
            this.Config.Logger.info((new Date()) + ' - Distance sensor is running in ' + (this.InTestMode() ? 'test' : 'production') + ' mode');
        }
        this.MICROSECDONDS_PER_CM = 1e6/34321;
        this.DistanceHistory = [];
    }

    Start(){
        // Only use the hardware if you have the pigpio library defined otherwise it's in a test mode
        if(!this.InTestMode()){
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
            setInterval(_.bind(function() {
                this.HandleCurrentDistance(this.Config.Test.TestFunction());
            }, this), this.Config.Test.RefreshSeconds * 1000);
        }
    }

    HandleCurrentDistance(distance){
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
            this.SetCurrentDistance(distance);
            return;
        }

        if(this.Config.Logger){
            this.Config.Logger.warn((new Date()) + ' - Invalid distance: ' + distance);
        }

        // The current reading isn't valid, go through the history and find the latest valid
        // reading and use that instead
        _.forEach(this.DistanceHistory, _.bind(function(checkDistance){
            if(this.IsValidDistance(checkDistance)){
                this.SetCurrentDistance(checkDistance);
            }
        }, this));
    }

    SetCurrentDistance(distance){
        // Update the property that stores the current distance
        this.CurrentDistance = distance;

        // Check to see if there's a method to invoke when the distance changes
        if(!_.isUndefined(this.Config.DistanceChanged)){
            // Check to see if there's a configured internal that should be respected between invoking the distance changed
            // function
            if(!_.isUndefined(this.Config.DistanceChangedInvokeInterval) && this.Config.DistanceChangedInvokeInterval > 0){
                
                // Calculate the time betwen the last invocation
                let now = (new Date).getTime();
                let diff = now - this.LastDistanceChangedInvoke;
                
                // If the last time invoked was never or the difference is greater than the configured interval then invoke
                // the distance changed function
                if(_.isUndefined(this.LastDistanceChangedInvoke) || (diff > this.Config.DistanceChangedInvokeInterval)){
                    this.LastDistanceChangedInvoke = (new Date).getTime();
                    if(this.Config.Logger){
                        this.Config.Logger.info((new Date()) + ' - Invoking DistanceChanged call with new distance: ' + distance);
                    }
                    this.Config.DistanceChanged(distance);
                }
                return;
            }

            // Save the last time invoked and invoke the distance changed method
            this.LastDistanceChangedInvoke = (new Date).getTime();
            this.Config.DistanceChanged(distance);
        }
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
            this.HandleCurrentDistance(diff / 2 / this.MICROSECDONDS_PER_CM);
          }      
    }

    InTestMode(){
        return typeof Gpio === 'undefined';
    }
}