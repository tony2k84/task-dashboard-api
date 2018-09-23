var MongoClient = require('mongodb').MongoClient;
//var init = require('./init');
var db;

module.exports.init = function () {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(process.env.MONGODB_URI,{ useNewUrlParser: true },
        function (err, client) {
            if (err) {
                console.error('database error', err);
                reject({err})
            }
            db = client.db('heroku_xslvtsrc'); 
            //init.users();
            //init.taskTypes();
            resolve({})
        })          
    });
};

module.exports.db = function () {
    return db
};