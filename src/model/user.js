var mongo = require('../mongo');
var jwt = require('jsonwebtoken');
var encHelper = require('../helpers/encryption-helper');
var ObjectId = require('mongodb').ObjectId;
var project = require('./project');

/* user login */
module.exports.login = function (email, password) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("users")
            .findOne({ email: email, password: encHelper.encrypt(password), enabled: true }, { projection: { password: false } })
            .then(function (user) {
                if (user === null) { reject({}); return }
                module.exports.logout(user._id)
                    .then(function () {
                        db.collection("sessions")
                            .insertOne({ userId: user._id, lastLogin: Date.now(), lastActivity: Date.now() })
                            .then(function ({ insertedCount }) {
                                if (insertedCount === 1) {
                                    // generate JWT
                                    var token = jwt.sign({
                                        id: user._id,
                                    }, process.env.JWT_SECRET, {});
                                    resolve({ token, user })
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
module.exports.get = function (userId = null, type = null) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        var query = null;
        if (userId === null) {
            query = { type }
        } else {
            if (type === null)
                query = { _id: new ObjectId(userId) }
            else
                query = { _id: new ObjectId(userId), type }
        }
        db.collection('users').find(query, { projection: { password: false } }).toArray(function (err, result) {
            if (err) reject({ err })
            else resolve(result)
        })
    });
}

/* get users */
module.exports.getByEmail = function (email) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        var query = { email };
        db.collection('users').findOne(query, { projection: { password: false } })
            .then(function (user) {
                resolve({ user })
            }).catch(function (err) {
                reject({ err });
            });
    });
}
/* user register */
module.exports.register = function (name, email, password, type = 'member') {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        // create a new
        db.collection('users')
            .findOneAndUpdate({ email }, { $set: { name, email, password: encHelper.encrypt(password), type, enabled: false } }, { upsert: true })
            .then(function () {
                resolve({})
            })
            .catch(function (err) {
                console.log('user.register.error', err);
                reject({ err });
            })
    });
}

/* user add project */
module.exports.addProject = function (projectId, name, email) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("users")
            .findOneAndUpdate(
                { email: email },
                { $addToSet: { members: { projectId, name } } },
                { returnNewDocument: true, projection: { name: true, email: true } })
            .then(function (user) {
                if (user && user.value) {
                    resolve({ user: user.value });
                } else {
                    console.log('error')
                    reject({ error: { msg: 'update failed' } })
                }
            })
    });
}