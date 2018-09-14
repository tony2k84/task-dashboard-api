var router = require('express').Router()
var user = require('../model/user')

/* get projects */
router.get('/', function (req, res) {
    res.status(201).json({code: 0});
});
/* create a project */
router.post('/', function (req, res) {
    res.status(201).json({code: 0});
});

module.exports = router
