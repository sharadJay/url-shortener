const btoa = require('btoa');
const atob = require('atob');
const {URLModel} = require('../model/models');

const createShortUrl = function (req, res, next) {
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
}

const getOriginalUrl = function (req, res, next) {
    const uniqueId = atob(req.params.url);
    URLModel.findById(uniqueId, function (err, doc) {
        if (err) {
            res.render("error", {message: err.message, error: err});
        } else {
            console.log(doc.url);
            res.status(301).redirect(doc.url);
        }
    })
}

module.exports = {createShortUrl, getOriginalUrl};