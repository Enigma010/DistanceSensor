const express = require('express');
const _ = require('lodash');
const Response = require('./../Response.js');
const GenericController = require('./GenericController.js');
const DistanceSensor = require('../../Model/DistanceSensor.js');

module.exports = class DistanceSensorController extends GenericController{
    constructor(server, distanceSensorConfig){
        super(server);

        // Setup the route handling for http
        this.Setup();

        // This is the object that actually gets the distance from the hardware
        this.DistanceSensor = new DistanceSensor(distanceSensorConfig);

        // Start processing distances from the hardware
        this.DistanceSensor.Start();
    }

    Read(request, response){
        // Get the current distance from the sensor
        var distance = this.DistanceSensor.CurrentDistance;

        // Send the distance back to the requestor
        this.SendResponseFunc(response)(null, distance);
    }

    Setup(){
        // Setup the route to read from the distance sensor
        this.SetupHandleRequest('/DistanceSensor/read', _.bind(this.Read, this));
    }
}