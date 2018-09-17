var mongo = require('../mongo');
var ObjectId = require('mongodb').ObjectId;

/* add project */
module.exports.add = function (name) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("projects")
            .insertOne({ name, members: [] })
            .then(function ({ insertedCount }) {
                if (insertedCount === 1) {
                    resolve({})
                }
            })
    });
}

/* get projects */
module.exports.get = function () {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection('projects').find().toArray(function (err, result) {
            if (err) reject({err})
            else resolve(result)
          })
    });
}

/* add project member*/
module.exports.addMember = function (projectId, user) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("projects")
            .updateOne(
                { _id: new ObjectId(projectId) },
                { $addToSet: { members: user } })
            .then(function ({ matchedCount }) {
                if (matchedCount === 1)
                    resolve({})
                else
                    reject({})
            })
    });
}