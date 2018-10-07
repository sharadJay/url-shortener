if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const addRequestId = require('express-request-id')();
mongoose.Promise = Promise;
const btoa = require('btoa');
const atob = require('atob');
mongoose.connect(process.env.Connection_String, {
    "useMongoClient": true
});
mongoose.set('debug', true);
const {URLModel, CounterModel} = require('../model/models');

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


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    URLModel.remove({});
    CounterModel.remove({}, function () {
        const counter = CounterModel({_id: 'url_count', counter: 10000});
        counter.save(function (err) {
            if (err) return console.error(err);
        })
    })
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'URL Shortener'});
});

/* Get request for creating short url */
router.post('/createUrl/', function (req, res, next) {
    console.log(req.body.url);
    const urlData = req.body.url;
    URLModel.findOne({url: urlData}, function (err, doc) {
        if (doc) {
            res.send({
                urlString: doc.url,
                shortId: btoa(doc._id),
                status: 200
            })
        } else {
            const newUrl = new URLModel({
                url: urlData,
                "_id": 10001
            });
            newUrl.save(function (err, addedDoc) {
                if (err) console.log(`error saving data ${err}`);
                res.send({
                    urlString: addedDoc.url,
                    shortId: btoa(addedDoc._id),
                    status: 200
                })
            })
        }
    });
});

/* Get request short url */
router.get('/get/:url', function (req, res, next) {
    const uniqueId = atob(req.params.url);
    console.log(uniqueId)
    URLModel.findById(uniqueId, function (err, doc) {
        if (err) {
            res.render("error");
        } else {
            res.redirect(301, doc.url);
        }
    })
});

router.get('/show', function (req, res) {
    var short = req.protocol + '://' + req.get('host') + "/get/" + req.query.short;
    res.render("minifiedUrlPage", {
        title: "Shortened URL",
        url: {shortenedUrl: short, originalUrl: req.query.original}
    })
});

module.exports = router;
