$("body").ready(function () {
    $("#go").on("click", function () {
        isEntryValid($("#url").val(), function (urlInput) {
            $(".form-group").removeClass("has-warning");
            createShortUrl(urlInput, displayShortUrl, function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            });
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

function createShortUrl(urlInput, successCallback, errorCallback) {
    $.ajax({
        type: "GET",
        url: "/createUrl/" + urlInput,
        dataType: "json",
        success: successCallback,
        error: errorCallback
    });
}

function displayShortUrl(data) {
    console.log(data);
    document.location.href = "/show?short=" + data.shortId + "&original=" + data.urlString;
}

function displayErrors() {
    $(".form-group").addClass("has-warning");
}