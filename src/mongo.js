var MongoClient = require('mongodb').MongoClient
var db;

if (db) {
    console.log('already connected');
} else {
    console.log('new connection');

    MongoClient.connect('mongodb://admin:admin123@ds261429.mlab.com:61429/task-dashboard', { useNewUrlParser: true },
        function (err, client) {
            if (err) throw err
            db = client.db('task-dashboard');
        })
}
module.exports.db = function () {
    return db
};