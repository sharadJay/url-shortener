$("body").ready(function () {
    $("#go").on("click", function () {
        isEntryValid($("#url").val(), function (urlInput) {
            console.log(urlInput + " is valid");
            createShortUrl(urlInput, displayShortUrl);
        }, function (inputUrl) {
            console.log(inputUrl + " is not valid");
            displayErrors()
        })
    });
});


function isEntryValid(inputUrl, successCallback, errorCallback) {
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (re.test(inputUrl)) {
        successCallback.call(this, inputUrl);
    } else {
        errorCallback.call(this, inputUrl);
    }
}

function createShortUrl(urlInput, successCallback) {
    $.ajax({
        type: "GET",
        url: "/createUrl/" + urlInput,
        dataType: "json",
        success: successCallback
    });
}

function displayShortUrl(data) {
    console.log(data);
    document.location.href = "/show?short=" + data.shortId + "&original=" + data.urlString;
}

function displayErrors() {

}