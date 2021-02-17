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

window.captures = [];
var viewer = undefined;

chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
function onBrowserActionClicked(tab) {

    // capture tab
    if (tab.id !== viewer?.id && !captures.some(capture => capture.tab.id == tab.id)) {
        chrome.tabCapture?.capture(constraints, function (stream) {
            if (stream === null) {
                console.log(`Last Error: ${chrome.runtime.lastError.message}`);
                return;
            }
            captures.push({ stream, tab });
        });
    } else {
        // stop capturing tab
        var capture = captures.find(capture => capture.tab.id == tab.id);
        console.log("Stop screen capture", capture);
        capture.stream.getVideoTracks().forEach(track => track.stop());
        capture.stream.getAudioTracks().forEach(track => track.stop());
        captures = captures.filter(item => item !== capture);
    }

    // only show one viewer page
    if (!viewer) {
        chrome.tabs.create({ url: "/index.html" }, tab => viewer = tab);
    }
}

// check if viewer page was closed
chrome.tabs.onRemoved.addListener(function (tabId) {
    if (tabId == viewer.id) {
        viewer = undefined;
    }
});
