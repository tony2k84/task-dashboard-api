var mongo = require('../mongo');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var encHelper = require('../helpers/encryption-helper');
var ObjectId = require('mongodb').ObjectId;
var project = require('./project');

/* user login */
module.exports.login = function (email, password) {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        db.collection("users")
            .findOne({ email: email, password: encHelper.encrypt(password) }, { projection: { password: false } })
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
                                    }, config.JWT_SECRET, {});
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
/* user register */
module.exports.register = function (name, email, password, type='member') {
    return new Promise(function (resolve, reject) {
        var db = mongo.db();
        // create a new
        db.collection('users')
            .updateOne({email}, { $set: {name, email, password: encHelper.encrypt(password), type}}, {upsert: true})
            .then(function () {
                // add a personal project for this
                return project.add(`${name}'s Project`, name, email)
            })
            .then(function ({projectId}){
                return module.exports.addProject(projectId, `${name}'s Project`, email)
            })
            .catch(function (err){
                console.log('user.register.error',err);
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
                { returnNewDocument: true, projection: {name: true, email: true}})
            .then(function (user) {
                if(user && user.value){
                    resolve(user.value);
                }else{
                    reject({error: {msg: 'update failed'}})
                }
            })
    });
}