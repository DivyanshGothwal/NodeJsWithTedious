const db = require('./TediousConnection');
const spMthod = require('./SPMethods');


var callRouteRepo = function(responseCallback, ScenarioID){
    db.callSp(spMthod.callSpGetRoutes,responseCallback,ScenarioID);
}

var callAffectedRepo = function(responseCallback, ScenarioID,routeId, scenarioDriverId){
    db.callSp(spMthod.callSpGetAffectedRoutes,responseCallback,ScenarioID,routeId, scenarioDriverId);
}

var callUpdateInboundTrailerETARepo = function(responseCallback, ScenarioID, IBTrailerData){
    db.callSp(spMthod.callUpdateInboundTrailerETA,responseCallback,ScenarioID, IBTrailerData);
}

var callGetRouteDto = function(responseCallback, response){
    db.callSp(spMthod.callGetRouteDto,responseCallback,response);
}


module.exports.callGetRouteDto = callGetRouteDto;
module.exports.callRouteRepo = callRouteRepo;
module.exports.callAffectedRepo = callAffectedRepo;
module.exports.callUpdateInboundTrailerETARepo = callUpdateInboundTrailerETARepo;
