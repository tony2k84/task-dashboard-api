var router = require('express').Router()
var user = require('../model/user');

/* login */
router.post('/login', function (req, res) {
    const { username, password } = req.body;
    user.login(username, password).then(function ({ token }) {
        res.status(200).json({ code: 0, token });
    }).catch(function (error) {
        res.status(401).json({ code: -1, error });
    })
});
/* register */
router.post('/register', function (req, res) {
    res.status(201).json({ code: 0 });
});
/* logout */
router.post('/logout', function (req, res) {
    user.logout(req.user.id).then(function () {
        res.status(200).json({ code: 0 });
    }).catch(function (error) {
        res.status(500).json({ code: -1, error });
    })
});

/* get users */
router.get('/', function (req, res) {
    user.get().then(function (users) {
        res.status(200).json({ code: 0, users });
    }).catch(function (error) {
        res.status(401).json({ code: -1, error });
    })
});
/* add project */
router.post('/project', function (req, res) {
    // get project details
    const { id, name } = req.body;
    user.addProject(req.user.id, { id, name })
        .then(function () {
            res.status(201).json({ code: 0 });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })

});
/* delete a project */
router.delete('/project', function (req, res) {
    // get project details
    const { id, name } = req.body;
    user.removeProject(req.user.id, { id, name })
        .then(function () {
            res.status(200).json({ code: 0 });
        })
        .catch(function (error) {
            res.status(500).json({ code: -1, error });
        })
});


module.exports = router;