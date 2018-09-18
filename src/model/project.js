var mongo = require('../mongo');
var ObjectId = require('mongodb').ObjectId;

/* add project */
module.exports.add = function (projectName, name = null, email = null) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("projects")
            .findOneAndUpdate({name: projectName}, { $set: {name: projectName, members: name?[{name, email}]: [] }}, {upsert: true, new: true})
            .then(function (result) {
                if(result.lastErrorObject.upserted){
                    resolve({projectId: result.lastErrorObject.upserted});
                }else if(result.value){
                    resolve({projectId: result.value._id});
                }
                else reject({error: {msg: 'unable to create project'}})
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