var router = require('express').Router()
var task = require('../model/task')
var auth = require('../middlewares/auth');

// middleware
router.use(auth.checkProjectAccess);

/* get tasks */
router.post('/', function (req, res) {
    task.get(req.body.projectId)
        .then(function (tasks) {
            res.status(200).json({ code: 0, tasks });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});
/* create task */
router.post('/add', function (req, res) {
    const { projectId, type, group, nextRun, owner } = req.body;
    task.add(projectId, type, group, nextRun, owner)
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
