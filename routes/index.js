if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const btoa = require('btoa');
const atob = require('atob');
mongoose.connect(process.env.Connection_String, {
    "useMongoClient": true
});
const {URLModel, CounterModel} = require('../model/models');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log("we're connected!");
    URLModel.remove({}, function () {
        console.log('removed all previously saved urls');
    });
    CounterModel.remove({}, function () {
        console.log("Counter collection removed");
        const counter = CounterModel({_id: 'url_count', counter: 10000});
        counter.save(function (err) {
            if (err) return console.error(err);
            console.log('counter inserted');
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
            console.log("entry found in db");
            res.send({
                urlString: doc.url,
                shortId: btoa(doc._id),
                status: 200
            })
        } else {
            console.log('entry NOT found in db, saving new');
            const newUrl = new URLModel({
                url: urlData,
                "_id": 10001
            });
            newUrl.save(function (err, addedDoc) {
                console.log("added dic", addedDoc, err)
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
        console.log("recieved request", doc);
        if (err) {
            res.render("error");
        } else {
            console.log("original url" + doc.url);
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
