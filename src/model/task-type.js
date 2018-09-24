var mongo = require('../mongo');

/* add task type */
module.exports.add = function (projectId, type) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("task-types")
            .updateOne({ projectId, type }, { $set: { projectId, value: type, text: type, type } }, { upsert: true })
            .then(function () {
                resolve({});   
            })
    });
}

/* get task types */
module.exports.get = function (projectId) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection('task-types').find({projectId}).toArray(function (err, result) {
            if (err) reject({ err })
            else resolve(result)
        })
    });
}