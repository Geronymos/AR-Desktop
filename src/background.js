const constraints = {
    audio: true,
    video: true,
    videoConstraints: {
        mandatory: {
            chromeMediaSource: 'tab',
            minWidth: 1920,
            maxWidth: 1920,
            minHeight: 1080,
            maxHeight: 1080
        }
    }
};

window.streams = [];

function init() {
    captureTab();
    chrome.tabs.create({ url: "/index.html" });
}

chrome.browserAction.onClicked.addListener(init);


function captureTab() {

    chrome.tabCapture.capture(constraints, function (stream) {
        if (stream === null) {
            console.log(`Last Error: ${chrome.runtime.lastError.message}`);
            return;
        }
        window.streams.push(stream);
    });
}