const express = require('express');
const _ = require('lodash');
const Response = require('./../Response.js');
const GenericController = require('./GenericController.js');
const DistanceSensor = require('../../Model/DistanceSensor.js');

module.exports = class DistanceSensorController extends GenericController{
    constructor(server, distanceSensorConfig){
        super(server);
        this.Setup();
        this.DistanceSensor = new DistanceSensor(distanceSensorConfig);
        this.DistanceSensor.Start();
    }

    Read(request, response){
        var distance = this.DistanceSensor.CurrentDistance;
        this.SendResponseFunc(response)(null, distance);
    }

    Setup(){
        this.SetupHandleRequest('/distanceSensor/read', _.bind(this.Read, this));
    }
}