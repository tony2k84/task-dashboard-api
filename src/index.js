var express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , app = express()
    , cors = require('cors')
    , auth = require('./middlewares/auth')
    , mongo = require('./mongo');

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(auth.authentication);

app.use(require('./controllers'));
mongo.init().then(function () {
    app.listen(process.env.PORT, () => console.log(`task-dashboard-api listening on port ${process.env.PORT}!`))
});