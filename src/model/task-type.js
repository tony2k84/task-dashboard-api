var mongo = require('../mongo');

/* add task type */
module.exports.add = function (type) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("task-types")
            .insertOne({ type })
            .then(function ({ insertedCount }) {
                if (insertedCount === 1) {
                    resolve({})
                }
            })
    });
}

/* get task types */
module.exports.get = function () {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection('task-types').find().toArray(function (err, result) {
            console.log(result);
            if (err) reject({err})
            else resolve(result)
          })
    });
}