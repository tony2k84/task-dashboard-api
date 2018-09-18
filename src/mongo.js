var MongoClient = require('mongodb').MongoClient;
var init = require('./init');
var db;

module.exports.init = function () {
    return new Promise(function (resolve, reject) {
        MongoClient.connect('mongodb://admin:admin123@ds261429.mlab.com:61429/task-dashboard', { useNewUrlParser: true },
        function (err, client) {
            if (err) reject({err})
            db = client.db('task-dashboard'); 
            //init.users();
            //init.taskTypes();
            resolve({})
        })
        
    });
};

module.exports.db = function () {
    return db
};