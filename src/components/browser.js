import { registerComponent } from "aframe";
import "./tab";
// import { VideoTexture } from "aframe/src/lib/three";
// import { VideoTexture } from "three";

export default registerComponent('browser', {
  schema: {
  },
  init: function () {
    this.background = chrome.extension.getBackgroundPage();
  },
  update: function () {
    const elem = this.el;
    const self = this;

    // 3d plane that shows the video element
    const plane = document.createElement("a-plane");
    elem.appendChild(plane);
    plane.setAttribute('tab', { stream: self.background.streams[0] });


    // get resolution
    chrome.tabCapture.getCapturedTabs(function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.get(tab.tabId, function(tab) {
          plane.setAttribute('tab', { tabSize: {x: tab.width, y: tab.height} });
        });
        // https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content
        chrome.tabs.executeScript(tab.tabId, { code: `(${onresize})()` })
      })
    })

    // listen for messages with new resolution
    chrome.runtime.onMessage.addListener(function (message, sender, response) {
      plane.setAttribute('tab', { tabSize: {x: message.width, y: message.height} });
    });

    // function for each captures tab that messages the new resolution
    function onresize() {
      window.addEventListener("resize", function (e) {
        chrome.runtime.sendMessage({ width: window.innerWidth, height: window.innerHeight })
      })
    }

  }
});
