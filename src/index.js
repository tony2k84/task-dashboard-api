var express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , app = express()
    , config = require('./config/config')
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

var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

if (config.MODE === 'HTTP' || config.MODE === 'BOTH') {
    mongo.init().then(function () {
        httpServer.listen(config.HTTP_PORT, function () {
            console.log('http server running on port:', config.HTTP_PORT)
        });
    });
}
if (config.MODE === 'HTTPS' || config.MODE === 'BOTH') {
    mongo.init().then(function () {
        httpsServer.listen(config.HTTPS_PORT, function () {
            console.log('https server listening on port:', config.HTTPS_PORT)
        });
    });
} 
