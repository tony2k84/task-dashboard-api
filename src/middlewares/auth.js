var jwt = require('jsonwebtoken');
var config = require('../config/config.js');
var user = require('../model/user');

module.exports = function (req, res, next) {
    if (req.url === '/v1/user/login') {
        next();
        return;
    }
    else {
        if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
            try {
                var userObj = jwt.verify(req.headers['authorization'], config.JWT_SECRET);
                user.authenticate(userObj.id)
                    .then(function () {
                        // user authenticated
                        req.user = userObj;
                        if (req.url.startsWith("/v1/project") || req.url.startsWith("/v1/task-type") || (req.url==='/v1/user/register')) {
                            // TODO: Admin authorization
                            next();
                            return;
                        } else if (req.url.startsWith("/v1/task")) {
                            // TODO: Project authorization - validate that user has access to project
                            next();
                            return;
                        } else {
                            next();
                            return;
                        }

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