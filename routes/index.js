if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const addRequestId = require('express-request-id')();
const {showHomepage,showMinfiedUrl} = require('./clientrouter');
const {createShortUrl, getOriginalUrl} = require('./serverrouter');
const {URLModel, CounterModel} = require('../model/models');

// express app setup
router.use(addRequestId);

morgan.token('id', function getId(req) {
    return req.id
});

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

router.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

router.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

// mongoose setup

mongoose.Promise = Promise;
mongoose.connect(process.env.Connection_String, { useNewUrlParser: true });
mongoose.set('debug', true);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    URLModel.deleteMany({}).exec();
    CounterModel.deleteMany({}, function () {
        const counter = CounterModel({_id: 'url_count', counter: 10000});
        counter.save(function (err) {
            if (err) return console.error(err);
        })
    })
});

// Routers

/* GET home page. */
router.get('/', showHomepage);

/* Get request for creating short url */
router.post('/createUrl/', createShortUrl);

/* Get request short url */
router.get('/get/:url', getOriginalUrl);
/* Show minfied url screen */
router.get('/show', showMinfiedUrl);

module.exports = router;
