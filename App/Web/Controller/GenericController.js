const express = require('express');
const _ = require('lodash');
const Response = require('./../Response.js');

module.exports = class GenericController{
    constructor(server){
        this.Server = server;
    }

    SetupHandleRequest(route, handler){
        let handleFunc = _.bind(function(request, response){
            handler(request, response);
        }, this);

        let handleRequestFunc = _.bind(function(request, response){
            this.HandleRequest(request, response, handleFunc);
        }, this);

        this.Server.post(route, handleRequestFunc);
    }

    HandleRequest(request, response, handler){
        try{
            handler(request, response);
        }
        catch(error){
            this.SendResponse(error);
        }
    }

    SendResponseFunc(response){
        return _.bind(function(error, data){
            let errorResponse = this.GetErrorResponse(error);
            if(_.isUndefined(data) || _.isNull(data)){
                data = [];
            }
            errorResponse.Data = data;
            response.json(errorResponse);
        }, this);
    }

    SendResponse(error, data){
        let errorResponse = this.GetErrorResponse(error);
        if(_.isUndefined(data) || _.isNull(data)){
            data = [];
        }
        errorResponse.Data = data;
        this.Response.json(errorResponse);
    }

    GetErrorResponse(error){        
        let response = null;
        if(error === null){
            response = new Response();
        }
        else{
            response = new Response(1, error);
        }
        return response;
    }
}