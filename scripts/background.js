var client = new Dropbox.Client({key: config.appKey}),
    authenticate,
    reportAuthError,
    logout,
    getAccountInfo;

client.onError.addListener(function (error) {
    reportAuthError(error);
    if (window.console) {
        console.error(error);
    }
});

authenticate = function () {
    client.authDriver(
        new Dropbox.AuthDriver.ChromeExtension({
            receiverPath: config.receiver
        }));

    client.authenticate(function (error, client) {
        getAccountInfo();
    });

};

authenticate();

logout = function () {
    client.signOut(function (error) {
        alert(chrome.i18n.getMessage("successful_logout"));
    })
};

getAccountInfo = function(){
    client.getAccountInfo(function (error, accountInfo) {
        alert(chrome.i18n.getMessage("successful_login", accountInfo.name));
    });
};

reportAuthError = function (error) {
    //TODO Do better error handling
    switch (error.status) {
        case Dropbox.ApiError.INVALID_TOKEN:
            authenticate();
            break;
        case Dropbox.ApiError.NOT_FOUND:
            alert("File or folder not found");
            break;
        case Dropbox.ApiError.OVER_QUOTA:
            alert("Unfortunately, your Dropbox is full");
            break;
        case Dropbox.ApiError.RATE_LIMITED:
            alert("Too many API requests. Try again later or contact with app developer.")
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