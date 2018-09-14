var router = require('express').Router()
var taskType = require('../model/task-type')

/* get task type */
router.get('/', function (req, res) {
    taskType.get()
        .then(function (taskTypes) {
            res.status(201).json({ code: 0, taskTypes });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});
/* create task type */
router.post('/', function (req, res) {
    const { type } = req.body;
    taskType.add(type)
        .then(function () {
            res.status(201).json({ code: 0 });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })

});

module.exports = router
