var mqtt = require('mqtt');
const _ = require('lodash');

module.exports = class Client{
    constructor(url, options, channelPrefix, logger){
        this.Url = url;
        this.Options = options;
        this.MqttClient = mqtt.connect(this.Url, this.Options);
        this.ChannelPrefix = channelPrefix;
        this.Logger = logger;
        
        if(_.isUndefined(this.ChannelPrefix) || _.isNull(this.ChannelPrefix)){
            this.ChannelPrefix = '';
        }
    }

    //Invoked when the distance sensor detects a change in distance to update the mqtt channel
    DistanceChanged(distance){
        // If we're not connected then try to connect to MQTT
        if(!this.MqttClient.connected){
            if(this.Logger){
                this.Logger.info((new Date()) + ' - Connecting a new MQTT client to ' + this.Url);
            }
            this.MqttClient = mqtt.connect(this.Url, this.Options);
        }

        // Only if we're connected publish the distance
        if(this.MqttClient.connected){
            let channel = this.ChannelPrefix + 'Distance';
            if(this.Logger){
                this.Logger.info((new Date()) + ' - Publishing distance ' + distance + " to channel " + channel);
            }
            this.MqttClient.publish(channel, distance.toString());
        }
        else{
            if(this.Logger){
                this.Logger.warn((new Date()) + ' - Failed to connect a MQTT client to ' + this.Url);
            }
        }
    }
};