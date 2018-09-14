var router = require('express').Router()

/* get task type */
router.get('/', function (req, res) {
    res.status(201).json({code: 0});
});
/* create task type */
router.post('/', function (req, res) {
    res.status(201).json({code: 0});
});

module.exports = router
