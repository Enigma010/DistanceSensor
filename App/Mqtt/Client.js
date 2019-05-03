var mqtt = require('mqtt');
const _ = require('lodash');

module.exports = class Client{
    constructor(url, options, channelPrefix){
        this.MqttClient = mqtt.connect(url, options);
        this.ChannelPrefix = channelPrefix;
        if(_.isUndefined(this.ChannelPrefix) || _.isNull(this.ChannelPrefix)){
            this.ChannelPrefix = '';
        }
    }

    //Invoked when the distance sensor detects a change in distance to update the mqtt channel
    DistanceChanged(distance){
        if(this.MqttClient.connected){
            this.MqttClient.publish(this.ChannelPrefix + 'Distance', distance.toString());
        }
        else{
            this.MqttClient.on('connect', _.bind(function(){
                this.MqttClient.publish(this.ChannelPrefix + 'Distance', distance.toString());
            }), this);
        }
    }
};