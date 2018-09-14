var router = require('express').Router()

/* get tasks */
router.get('/', function (req, res) {
    res.status(201).json({code: 0});
});
/* create task */
router.post('/', function (req, res) {
    res.status(201).json({code: 0});
});
/* complete task */
router.post('/complete', function (req, res) {
    res.status(201).json({code: 0});
});
/* get task type */
router.get('/task-types', function (req, res) {
    res.status(201).json({code: 0});
});
/* create task type */
router.post('/task-types', function (req, res) {
    res.status(201).json({code: 0});
});

module.exports = router
