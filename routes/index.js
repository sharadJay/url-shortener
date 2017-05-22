var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/url');
var urlModel = mongoose.model('url', {shortId: String, urlString: String});
var shortid = require('shortid');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'URL Shortener'});
});

/* Get request for creating short url */
router.get('/createUrl/:url', function (req, res, next) {
    urlModel.find({urlString: req.params.url}, function (err, docsFound) {
        if (err) {
            console.log(err);
        } else {
            if (docsFound.length) {
                res.send(docsFound[0]);
            } else {
                var newUrl = new urlModel({shortId: shortid.generate(), urlString: req.params.url});
                newUrl.save(function (err, addedDoc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(addedDoc[0]);
                    }
                });
            }
        }
    });
});

/* Get request short url */
router.get('/get/:url', function (req, res, next) {
    urlModel.find({shortId: req.params.url}, function (err, doc) {
        console.log("recieved request");
        if (err) {
            res.render("error");
        } else {
            res.redirect(301, "https://" + doc[0].urlString);
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
