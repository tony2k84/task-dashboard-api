var mongo = require('../mongo');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var encHelper = require('../helpers/encryption-helper');
var ObjectId = require('mongodb').ObjectId;

/* user login */
module.exports.login = function (username, password) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("users")
            .findOne({ username: username, password: encHelper.encrypt(password) })
            .then(function (user) {
                module.exports.logout(user._id)
                    .then(function () {
                        db.collection("sessions")
                            .insertOne({ userId: user._id, lastLogin: Date.now(), lastActivity: Date.now() })
                            .then(function ({ insertedCount }) {
                                if (insertedCount === 1) {
                                    // generate JWT
                                    var token = jwt.sign({
                                        id: user._id,
                                    }, config.JWT_SECRET, { expiresIn: 60 * 60 });
                                    resolve({ token })
                                }
                            })
                    }).catch(function (error) {
                        reject({ error })
                    })

            })
    });
}
/* user logout */
module.exports.logout = function (userId) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("sessions")
            .deleteMany({ userId: new ObjectId(userId) })
            .then(function (doc) {
                resolve({});
            }).catch(function (error) {
                reject({ error });
            })
    });
}
/* user authenticate */
module.exports.authenticate = function (userId) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("sessions")
            .findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { $set: { lastActivity: Date.now() } },
                { returnNewDocument: true }
            )
            .then(function (session) {
                if (session.value) {
                    resolve({})
                } else {
                    reject({})
                }
            })
    });
}
/* get users */
module.exports.get = function () {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection('users').find({type: "member"},{projection: {_id: true, username: true}}).toArray(function (err, result) {
            if (err) reject({err})
            else resolve(result)
          })
    });
}
/* user register */
module.exports.register = function (name, email) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        //TODO: generate password
        var password = encHelper.encrypt('newpassword');
        var type = 'member';
        db.collection("users")
            .insertOne({ name, email, password, type })
            .then(function ({ insertedCount }) {
                if (insertedCount === 1) {
                    // TODO: send email
                    resolve({})
                }
            })
    });
}

/* user add project */
module.exports.addProject = function (userId, project) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        //TODO: generate password
        var password = 'newpassword';
        db.collection("users")
            .updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { projects: project } })
            .then(function ({ matchedCount }) {
                if (matchedCount === 1)
                    resolve({})
                else
                    reject({})
            })
    });
}

/* user add project */
module.exports.removeProject = function (userId, project) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("users")
            .updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { projects: project } })
            .then(function ({ matchedCount }) {
                if (matchedCount === 1)
                    resolve({})
                else
                    reject({})
            })
    });
}