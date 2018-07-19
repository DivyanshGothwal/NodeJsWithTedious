var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var moment = require('moment');



let IdListType = {
    columns: [
      {name: 'ID', type: TYPES.Int}
    ],
    rows: []
};

let inboundTrailerDispatchStatusListType = {
    columns: [
      {name: 'ManifestNumber', type: TYPES.NVarChar, length: 20, nullable: true },
      {name: 'ETA', type: TYPES.Time, nullable: true},
      {name: 'ManifestArrivalStatus', type: TYPES.NVarChar, length: 20, nullable: true }
    ],
    rows: []
};


var callSpGetRoutes = function(responseCallback,connection, params){
    
    let request = new Request("[dbo].[uspGetAllShipments]", function(err,rowCount,rows) {
        if(err){
            console.log(err);
        }
        else{
            var response = CreateResposeArray(rows);
            response.shift();
            responseCallback(response);
        }
    });

    request.addParameter('ScenarioID', TYPES.Int, params[0]);
    connection.callProcedure(request);

};



var callSpGetAffectedRoutes = function(responseCallback, connection, params){
    let request = new Request("[dbo].[uspGetAffectedRoutes]", function(err,rowCount,rows) {
        if(err){
            console.log(err);
        }
        var response = CreateResposeArray(rows);
        response.shift();
        responseCallback(response);
    });

    IdListType.rows = [];
    params[1].forEach(ele=>{
        let newArray =[ele];
        IdListType.rows.push(newArray);
    });
    request.addParameter('tblRouteId', TYPES.TVP, IdListType);
    request.addParameter('ScenarioID', TYPES.Int, params[0]);
    request.addParameter('ScenarioDriverID', TYPES.Int, params[2]);
    connection.callProcedure(request);
};




var callGetRouteDto = function(responseCallback, connection, params){
    let responseArray = [];
    let request = new Request("[dbo].[uspGetRouteAndStopAndShipmentDetails]", function(err,rowCount,rows) {
        if(err){
            console.log(err);
        }
        else{
            responseArray.shift();
            responseCallback(responseArray);
        }
    });

    IdListType.rows=[];

    params[0].forEach(ele=>{
        let newArray =[ele.RouteID];
        IdListType.rows.push(newArray);
    });
    request.addParameter('tblRouteId', TYPES.TVP, IdListType);
    connection.callProcedure(request);
    request.on('doneInProc', function (rowCount, more, rows) { 
        var response = CreateResposeArray(rows);
        responseArray.push(response);
    });
};


function callUpdateInboundTrailerETA(responseCallback, connection, params){
    let request = new Request("[dbo].[uspUpdateInboundTrailerDispatchStatus]", function(err,rowCount,rows) {
        if(err){
            console.log(err);
        }
        else{
        var response = CreateResposeArray(rows);
        response.shift();
        responseCallback(response);
        }
    });

    inboundTrailerDispatchStatusListType.rows = [];
    params[1].forEach(ele=>{
        let manifest = ele.ManifestNumber;
        let arrivalStatus = ele.ManifestArrivalStatus;
        let newArray =[manifest,ele.ETA ==undefined ? null:ele.ETA,arrivalStatus];
        inboundTrailerDispatchStatusListType.rows.push(newArray);
    });

    request.addParameter('ScenarioID', TYPES.Int, params[0]);
    request.addParameter('tblInboundTrailerDispatchStatus', TYPES.TVP, inboundTrailerDispatchStatusListType);    
    connection.callProcedure(request);
}


function CreateResposeArray(rows){
    jsonArray = []
    rows.forEach(function (columns) {
    var rowObj ={};
    columns.forEach(function(column) {
        rowObj[column.metadata.colName] = column.value;
    });
        jsonArray.push(rowObj)
    });
    var x1 = JSON.stringify(jsonArray);
    var x =jsonArray[0];
    return jsonArray;
}


module.exports.callGetRouteDto = callGetRouteDto
module.exports.callSpGetAffectedRoutes = callSpGetAffectedRoutes;
module.exports.callSpGetRoutes = callSpGetRoutes;
module.exports.callUpdateInboundTrailerETA = callUpdateInboundTrailerETA;