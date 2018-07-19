const Connection = require('tedious').Connection;

var config = {
    userName:'yourUserName',
    password:'yourPassword',
    server:'yourServer',
    options:{
        database:'yourDatabase',
        rowCollectionOnRequestCompletion: true,
        rowCollectionOnDone : true
    }
};


 function callSp(callback,responseCallback,...params){
    let connection = new Connection(config);
    connection.on('connect',function(err){
    if(err){
        console.log(err);
    }
    else{
        callback(responseCallback, connection, params);
    }
});}


module.exports.callSp = callSp;