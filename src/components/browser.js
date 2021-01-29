import { registerComponent } from "aframe";
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

    // video element that holds the stream
    const video = document.createElement("video");
    video.srcObject = self.background.streams[0];
    video.play();

    // https://stackoverflow.com/questions/26076259/get-media-detailsresolution-and-frame-rate-from-mediastream-object
    const video_info = video.srcObject.getVideoTracks()[0].getSettings();
    console.log("video info", video_info);

    // 3d plane that shows the video element
    const plane = document.createElement("a-plane");
    elem.appendChild(plane);
    plane.setAttribute('geometry', { width: 16 / 9, height: 1 });
    plane.setAttribute('material', { src: video, repeat: { x: 1, y: 1 } });


    // get resolution
    chrome.tabCapture.getCapturedTabs(function (tabs) {
      tabs.forEach(function (tab) {
        // resize(tab, video_info);
        // https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content
        chrome.tabs.executeScript(tab.tabId, { code: `(${onresize})()` })
      })
    })

    // listen for messages with new resolution
    chrome.runtime.onMessage.addListener(function (message, sender, response) {
      resize(message, video_info);
    });
    
    
    // correct aspect ratio
    function resize(tabSize, videoSize) {
      plane.setAttribute('geometry', { width: tabSize.width / tabSize.height, height: 1 });

      const texture = plane.object3D.children[0].material.map;
      // https://stackoverflow.com/questions/32187035/three-js-make-image-texture-fit-object-without-distorting-or-repeating
      // texture.repeat.x = (tabSize.width / videoSize.width) / (tabSize.height / videoSize.height);
      texture.repeat.x = Math.min((tabSize.width * videoSize.height) / (tabSize.height * videoSize.width), 1);
      texture.repeat.y = Math.min((tabSize.height * videoSize.width) / (tabSize.width * videoSize.height), 1);
      // texture.repeat.y = 1;
      // texture.repeat.y = 1;
      texture.center.x = 0.5;
      texture.center.y = 0.5;

      // texture.needsUpdate = true;
    }

    // function for each captures tab that messages the new resolution
    function onresize() {
      window.addEventListener("resize", function (e) {
        chrome.runtime.sendMessage({ width: window.innerWidth, height: window.innerHeight })
      })
    }

  }
});
