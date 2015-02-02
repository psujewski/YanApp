var client = new Dropbox.Client({key: config.appKey}),
    authDriver = new Dropbox.AuthDriver.ChromeExtension({
        receiverPath: config.receiver
    }),
    authenticate,
    initExtension,
    initPopup,
    alertWelcomeMessage,
    reportAuthError,
    getAccountInfo,
    pollForChanges,
    pullChanges,
    readFile,
    writeFile;

initPopup = function (thatClient) {
    chrome.browserAction.setPopup({popup: config.popup})
    client = thatClient
}

initExtension = function () {
    client.authDriver(authDriver)
    client.authenticate({interactive: false}, function(error, thatClient) {
        if (error) {
            return reportAuthError()
        }
        if (client.isAuthenticated()) {
            client = thatClient
            console.log("Extension already initialized")
        } else {
            console.log("Initialize extension")
            authenticate()
        }
    });
}

authenticate = function () {
    client.authenticate(function (error, thatClient) {
        if (error) {
            return reportAuthError()
        }
        client = thatClient
        alertWelcomeMessage()
        console.log("successful authentication")
    })
}

alertWelcomeMessage = function () {
    chrome.storage.local.get("name", function (data) {
        if (!_.isUndefined(data.name)) {
            console.log("getAccountInfo from local storage")
            alert(chrome.i18n.getMessage("successful_login", data.name))
        } else {
            getAccountInfo()
        }
    })
}

getAccountInfo = function () {
    console.log("getAccountInfo from dropbox")
    client.getAccountInfo(function (error, accountInfo) {
        if (error) {
            reportAuthError(error)
        }
        chrome.storage.local.set({name: accountInfo.name}, function () {
            console.log("account info stored")
        })
        alert(chrome.i18n.getMessage("successful_login", accountInfo.name))
    })
}

pollForChanges = function (cursor) {
    client.pollForChanges(cursor, function (error, cursor) {
        if (error) {
            reportAuthError(error)
        }
        console.log(JSON.stringify(cursor))
    })
}

pullChanges = function (cursor) {
    console.log("pullChanges")
    client.pullChanges(cursor, function (error, result) {
        if (error) {
            reportAuthError(error)
        }
        _.each(result.changes, function (element) {

        })
    })
}

readFile = function (filePath) {
    client.readFile(filePath, function (error, data) {
        if (error) {
            reportAuthError(error)
        }
        console.log(JSON.stringify(data))
    })
}

writeFile = function (fileName, text) {
    client.writeFile(fileName, text, function (error, stat) {
        if (error) {
            reportAuthError(error)
        }
        console.log(JSON.stringify(stat))
    })
}

reportAuthError = function (error) {
    //TODO Do better error handling
    console.log(error.status)
    switch (error.status) {
        case Dropbox.ApiError.INVALID_TOKEN:
            alert("Invalid token reauthentication")
            authenticate()
            break
        case Dropbox.ApiError.NOT_FOUND:
            alert("File or folder not found")
            break
        case Dropbox.ApiError.OVER_QUOTA:
            alert("Unfortunately, your Dropbox is full")
            break
        case Dropbox.ApiError.RATE_LIMITED:
            alert("Too many API requests. Try again later or contact with app developer.")
            break
        case Dropbox.ApiError.NETWORK_ERROR:
            alert("Probably your network connection is down.")
            break
        case Dropbox.ApiError.INVALID_PARAM:
        case Dropbox.ApiError.OAUTH_ERROR:
        case Dropbox.ApiError.INVALID_METHOD:
        default:
            alert("Error occurred. Please try again later")
    }
}