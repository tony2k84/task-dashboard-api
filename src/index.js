var express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , app = express()
    , cors = require('cors')
    , fs = require('fs')
    , http = require('http')
    , https = require('https')
    , privateKey = fs.readFileSync('./src/config/9883630_task-dashboard-api.key', 'utf8')
    , certificate = fs.readFileSync('./src/config/9883630_task-dashboard-api.cert', 'utf8')
    , credentials = { key: privateKey, cert: certificate }
    , auth = require('./middlewares/auth')
    , mongo = require('./mongo')
    

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(auth.authentication);

app.use(require('./controllers'));

mongo.init().then(function () {
    app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
});