const Gpio = require('pigpio').Gpio;


module.exports = class DistanceSensor{
    constructor(config){
        this.Config = config;
        this.Trigger = new Gpio(this.Config.TriggerPinNum, {mode: Gpio.OUTPUT});
        this.Echo = new Gpio(this.Config.EchoPinNum, {mode: Gpio.INPUT, alert: true});
        this.MICROSECDONDS_PER_CM = 1e6/34321;
    }

    Start(){
        this.Trigger.digitalWrite(0); // Make sure trigger is low
        this.HandleTriggerFunc = _.bind(this.HandleTrigger, this);
        this.HandleTriggerFunc();
        // Trigger a distance measurement once per second
        setInterval(_.bind(function(){
            this.Trigger.trigger(10, 1); // Set trigger high for 10 microseconds
        }, this), 1000);
    }

    HandleTrigger(level, tick){
        if (level == 1) {
            this.StartTick = tick;
          } else {
            const endTick = tick;
            const diff = (endTick >> 0) - (this.StartTick >> 0); // Unsigned 32 bit arithmetic
            this.CurrentDistance = diff / 2 / this.MICROSECDONDS_PER_CM;
          }      
    }
}