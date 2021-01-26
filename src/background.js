function init() {

    chrome.tabs.create({ url: "/index.html" });
}

chrome.browserAction.onClicked.addListener(init);