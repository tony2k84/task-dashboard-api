var router = require('express').Router()
var task = require('../model/task')
var auth = require('../middlewares/auth');

// middleware
router.use(auth.checkProjectAccess);

/* get tasks */
router.get('/', function (req, res) {
    task.get()
        .then(function (tasks) {
            res.status(200).json({ code: 0, tasks });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});
/* create task */
router.post('/', function (req, res) {
    const { type, application, owner, lastRun, nextRun } = req.body;
    task.add(type, application, owner, lastRun, nextRun)
        .then(function () {
            res.status(201).json({ code: 0 });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});
/* complete task */
router.post('/complete', function (req, res) {
    const { id, lastRun, nextRun } = req.body;
    task.complete(id, lastRun, nextRun)
        .then(function () {
            res.status(200).json({ code: 0 });
        })
        .catch(function (error) {
            console.log('error', error);
            res.status(500).json({ code: -1, error });
        })
});


module.exports = router
