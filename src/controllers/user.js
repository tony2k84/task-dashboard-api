var router = require('express').Router()
var user = require('../model/user');
var auth = require('../middlewares/auth');

/* login */
router.post('/login', function (req, res) {
    const { email, password } = req.body;
    user.login(email, password).then(function ({ token, user }) {
        res.status(200).json({ code: 0, token, user });
    }).catch(function (error) {
        res.status(401).json({ code: -1, error });
    })
});
/* register */
router.post('/register', function (req, res) {
    const { name, email, password } = req.body;
    user.register(name, email, password)
    .then(function (user) {
        res.status(201).json({ code: 0 });
    }).catch(function (err) {
        console.log('error', err);
        res.status(401).json({ code: -1, error });
    })
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
        console.log(error);
        res.status(401).json({ code: -1, error });
    })
});


module.exports = router;