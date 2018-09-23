var MongoClient = require('mongodb').MongoClient;
var init = require('./init');
var config = require('./config/config')
var db;

module.exports.init = function () {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(config.MONGO_URI,{ useNewUrlParser: true },
        function (err, client) {
            if (err) reject({err})
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