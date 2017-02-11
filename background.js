//regular expression table
var regexpTable = []
chrome.storage.sync.get({'regexp_data': null}, function (result) {
    var data = result.regexp_data
    if (data == null)
        return
    regexpTable = data
});

var optionTabId = undefined
//open option page
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({'url': chrome.runtime.getURL('option.html')}, function (tab) {
        optionTabId = tab.id
    })
})

//redirect web quest which is not omnibar
chrome.webRequest.onBeforeRequest.addListener(
    function (info) {
        if (info.url == chrome.runtime.getURL('option.html'))
            return {'cancel': false}
        for (var i = 0; i < regexpTable.length; i++) {
            if (regexpTable[i] == undefined)
                continue
            if (regexpTable[i][3] == "checked") {
                var patt = new RegExp(regexpTable[i][1])
                if (regexpTable[i][1] == info.url || patt.test(info.url)) {
                    var regexp_url = patt.exec(info.url)
                    if (regexpTable[i][2] == info.url)
                        return {'cancel': false}
                    else if (regexpTable[i][2] == "redirect") {
                        if (regexp_url == info.url)
                            return {'cancel': false}
                        else {
                            if (regexp_url.indexOf("http%3A") == 0 || regexp_url.indexOf("https%3A") == 0 || regexp_url.indexOf("file%3A") == 0)
                                return {redirectUrl: decodeURIComponent(regexp_url)}
                            else
                            {
                                //console.log(info.url)
                                //console.log(regexp_url)
                                return {redirectUrl: regexp_url}
                            }
                        }
                    }
                    else
                        return {redirectUrl: regexpTable[i][2]}
                }
            }
        }
        return {'cancel': false}
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]);

//redirect omnibar
chrome.webNavigation.onBeforeNavigate.addListener(function (data) {
    if (data.url == chrome.runtime.getURL('option.html'))
        return
    //console.log('berfore is:' + data.url)
    for (var i = 0; i < regexpTable.length; i++) {
        if (regexpTable[i] == undefined)
            continue
        if (regexpTable[i][3] == "checked") {
            var patt = new RegExp(regexpTable[i][1])
            if (regexpTable[i][1] == data.url || patt.test(data.url)) {
                var regexp_url = patt.exec(data.url)
                console.log(regexp_url)
                if (regexpTable[i][2] == data.url)
                    return
                else if (regexpTable[i][2] == "redirect") {
                    if (regexp_url == data.url)
                        return
                    else {
                        if (regexp_url.indexOf("http%3A") == 0 || regexp_url.indexOf("https%3A") == 0 || regexp_url.indexOf("file%3A") == 0)
                            chrome.tabs.update(null, {url: decodeURIComponent(regexp_url)}, function () {
                            })
                        else
                            chrome.tabs.update(null, {url: regexp_url}, function () {
                            })
                    }

                }
                else
                    chrome.tabs.update(null, {url: regexpTable[i][2]}, function () {
                    })
            }
        }
    }
})

//listen to data change
chrome.storage.onChanged.addListener(function (changes, sync) {
    for (key in changes) {
        var storageChange = changes[key];
        if (key == 'regexp_data')
            regexpTable = storageChange.newValue
    }
})

//clean up array after option page closed
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (tabId == optionTabId) {
        spliceTable(regexpTable)
        chrome.storage.sync.set({'regexp_data': regexpTable}, function () {

        })
    }
    console.log(regexpTable)
})

//delete undefined element by recursion
function spliceTable(table) {
    for (var i = 0; i < regexpTable.length; i++) {
        if (regexpTable[i] == undefined) {
            regexpTable.splice(i, 1)
            return spliceTable(table)
        }
    }
}