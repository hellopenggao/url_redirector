

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({'url':chrome.runtime.getURL('option.html')}, function (){})
    })


chrome.webRequest.onBeforeRequest.addListener(
    function (info) {
            //console.log(info.url)

            return {'cancel': false}
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]);

var flag=true
chrome.webNavigation.onBeforeNavigate.addListener(function(data) {
    console.log('berfore is:'+data.url)
    console.log(chrome.i18n.getMessage('inHandler'), '123', data);
    if(data.url=='https://www.baidu.com/'&&flag==true){
        chrome.tabs.reload()
        console.log('reload')
        flag=false
    }
})