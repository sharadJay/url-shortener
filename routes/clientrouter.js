const showMinfiedUrl = function (req, res) {
    var short = req.protocol + '://' + req.get('host') + "/get/" + req.query.short;
    res.render("minifiedUrlPage", {
        title: "Shortened URL",
        url: {shortenedUrl: short, originalUrl: req.query.original}
    })
};


const showHomepage = function (req, res, next) {
    res.render('index', {title: 'URL Shortener'});
};

module.exports = {showMinfiedUrl, showHomepage};