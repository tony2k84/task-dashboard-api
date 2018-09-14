var express = require('express')
  , router = express.Router()

router.get('/v1', function (req, res) {
    res.status(201).json({});
})

router.use('/v1/user', require('./user'));
router.use('/v1/task', require('./task'));
router.use('/v1/task-type', require('./task-type'));
router.use('/v1/project', require('./project'));

module.exports = router;
