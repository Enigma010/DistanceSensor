var mqtt = require('mqtt');
const _ = require('lodash');

module.exports = class Client{
    constructor(url, options, channelPrefix){
        this.Url = url;
        this.Options = options;
        this.MqttClient = mqtt.connect(this.Url, this.Options);
        this.ChannelPrefix = channelPrefix;
        
        if(_.isUndefined(this.ChannelPrefix) || _.isNull(this.ChannelPrefix)){
            this.ChannelPrefix = '';
        }
    }

    //Invoked when the distance sensor detects a change in distance to update the mqtt channel
    DistanceChanged(distance){
        // If we're not connected then try to connect to MQTT
        if(!this.MqttClient.connected){
            this.MqttClient = mqtt.connect(this.Url, this.Options);
        }

        // Only if we're connected publish the distance
        if(this.MqttClient.connected){
            this.MqttClient.publish(this.ChannelPrefix + 'Distance', distance.toString());
        }
    }
};