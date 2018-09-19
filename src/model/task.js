var mongo = require('../mongo');
var ObjectId = require('mongodb').ObjectId;

/* add task */
module.exports.add = function (projectId, type, group, description, nextRun, owner) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("tasks")
            .insertOne({ projectId, type, group, description, nextRun, owner })
            .then(function ({ insertedCount }) {
                if (insertedCount === 1) {
                    resolve({})
                }
            })
    });
}

/* get task */
module.exports.get = function (projectId) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection('tasks').find({projectId}).toArray(function (err, result) {
            if (err) reject({ err })
            else resolve(result)
        })
    });
}

/* complete task */
module.exports.complete = function (taskId, lastRun, nextRun) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("tasks")
            .updateOne(
                { _id: new ObjectId(taskId) },
                { $set: { lastRun: lastRun, nextRun: nextRun } })
            .then(function ({matchedCount}) {
                if(matchedCount===1)
                    resolve({})
                else
                    reject({error: {msg: 'task not found'}})    
            }).catch(function (err){
                reject({err})
            })
    });
}