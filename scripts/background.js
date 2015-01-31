var client = new Dropbox.Client({key: config.appKey}),
    authDriver = new Dropbox.AuthDriver.ChromeExtension({
        receiverPath: config.receiver
    }),
    authenticate,
    logout,
    reportAuthError,
    getAccountInfo,
    pollForChanges,
    pullChanges;

client.onError.addListener(function (error) {
    reportAuthError(error);
});

authenticate = function () {
    alert("authenticate");
    client.authDriver(authDriver);
    client.authenticate(function (error, client) {
        getAccountInfo();
    });
};

logout = function () {
    client.signOut(function (error) {
        alert(chrome.i18n.getMessage("successful_logout"));
    })
};

getAccountInfo = function () {
    client.getAccountInfo(function (error, accountInfo) {
        alert(chrome.i18n.getMessage("successful_login", accountInfo.name));
    });
};

pollForChanges = function (cursor) {
    client.pollForChanges(cursor, function (error, cursor) {
        console.log(JSON.stringify(cursor))
    })
};

pullChanges = function (cursor) {
    client.pullChanges(cursor, function (error, result) {
        console.log(result.cursor());
        _.each(result.changes, function (element) {
            console.log(JSON.stringify(element));
        })
    })
};

reportAuthError = function (error) {
    //TODO Do better error handling
    console.log(error.status);
    switch (error.status) {
        case Dropbox.ApiError.INVALID_TOKEN:
            alert("Invalid token reauthentication");
            authenticate();
            break;
        case Dropbox.ApiError.NOT_FOUND:
            alert("File or folder not found");
            break;
        case Dropbox.ApiError.OVER_QUOTA:
            alert("Unfortunately, your Dropbox is full");
            break;
        case Dropbox.ApiError.RATE_LIMITED:
            alert("Too many API requests. Try again later or contact with app developer.");
            break;
        case Dropbox.ApiError.NETWORK_ERROR:
            alert("Probably your network connection is down.");
            break;
        case Dropbox.ApiError.INVALID_PARAM:
        case Dropbox.ApiError.OAUTH_ERROR:
        case Dropbox.ApiError.INVALID_METHOD:
        default:
            alert("Error occurred. Please try again later");
    }
};