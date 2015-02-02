chrome.runtime.getBackgroundPage(function (page) {
    client = page.client
    chrome.storage.local.get("cursor", function (data) {
        var cursor = data.cursor || null
        console.log(cursor)
        pullChanges(cursor)
    })
})