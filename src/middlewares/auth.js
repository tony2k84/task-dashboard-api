var jwt = require('jsonwebtoken');
var user = require('../model/user');
var _ = require('lodash');

module.exports.authentication = function (req, res, next) {
    if (req.url === '/v1/user/login') {
        next();
        return;
    }
    else {
        if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
            try {
                var userObj = jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
                user.authenticate(userObj.id)
                    .then(function () {
                        // user authenticated
                        req.user = userObj;
                        next();
                        return;
                    })
                    .catch(function (error) {
                        return res.status(401).json({
                            error: {
                                msg: 'Failed to authenticate token!'
                            }
                        });
                    })
            } catch (err) {
                return res.status(401).json({
                    error: {
                        msg: 'Failed to authenticate token!'
                    }
                });
            }
        } else {
            return res.status(401).json({
                error: {
                    msg: 'No token!'
                }
            });
        }
    }
};

module.exports.checkAdmin = function (req, res, next) {
    user.get(req.user.id)
        .then(function (users) {
            if (users[0].type === 'admin') {
                next();
                return;
            } else {
                return res.status(401).json({
                    error: {
                        msg: 'admin access required'
                    }
                });
            }
        })

}

module.exports.checkProjectAccess = function (req, res, next) {
    user.get(req.user.id)
        .then(function (users) {
            const isProjectAuthorized = _.findIndex(users[0].members, function(o) { 
                return o.projectId.toString() == req.body.projectId; 
            });
            if(isProjectAuthorized !== -1){
                // found
                next();
                return;
            }else{
                return res.status(401).json({
                    error: {
                        msg: 'User doesnot have access to the project'
                    }
                });
            }            
        })
}