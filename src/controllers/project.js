var router = require('express').Router()
var auth = require('../middlewares/auth');
var user = require('../model/user');
var project = require('../model/project')

/* get projects */
router.get('/', auth.checkAdmin, function (req, res) {
    project.get()
        .then(function (projects) {
            res.status(200).json({ code: 0, projects });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});
/* create a project */
router.post('/', auth.checkAdmin, auth.checkAdmin, function (req, res) {
    const { name } = req.body;
    project.add(name)
        .then(function () {
            res.status(201).json({ code: 0 });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});
/* add member */
router.post('/add-member', auth.checkAdmin, function (req, res) {
    const { projectId, projectName, email } = req.body;
    user.addProject(projectId, projectName, email)
        .then(function ({user}) {
            return project.addMember(projectId, user)
        })
        .then(function (){
            res.status(201).json({ code: 0 });
        })
        .catch(function (err) {
            res.status(500).json({ code: -1, err });
        })
});
module.exports = router
