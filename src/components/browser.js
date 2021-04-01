import { registerComponent } from "aframe";
import "./window"
// import { VideoTexture } from "aframe/src/lib/three";
// import { VideoTexture } from "three";

export default registerComponent('browser', {
  schema: {
    // targets: {type: 'selectors'}
  },
  init: function () {
    this.background = chrome.extension.getBackgroundPage();
    this.tabs = this.background.captures;
  },
  update: function () {
    const elem = this.el;
    const self = this;


    self.onTabsChange();

    // listen for messages with new resolution
    chrome.runtime.onMessage.addListener(function (message, sender, response) {
      switch (message.action) {
        case "start":
          self.onTabsChange();
          break;
        case "stop":
          self.onTabsChange();
          break;
        case "resize":
          var capture = self.tabs.find(capture => capture.tab.id == sender.tab.id);
          capture?.plane.setAttribute('tab', { tabSize: { x: message.width, y: message.height } });
          break;
      }
    });

  },
  onTabsChange: function () {
    const elem = this.el;
    const self = this;

    const hud = document.getElementById("hud");
    const markers = document.getElementById("markers");

    for (let child of [...hud.children, ...markers.children]) {
      child.parentNode.removeChild(child);
    }

/*     const myTabs = document.getElementById("tabs");
    myTabs.innerHTML = ""; */

    chrome.extension.getBackgroundPage().captures.forEach(function ({ tab, stream }, index) {
      console.log(stream.id);
      const container = document.createElement("a-plane");
      container.setAttribute("window", { tab, stream });
      container.setAttribute("position", { x: index * 2, y: 0, z: -5 });

      hud.appendChild(container);

      const marker = document.createElement("a-marker");
      marker.setAttribute("type", "barcode");
      marker.setAttribute("value", index);

      const container_two = document.createElement("a-plane");
      container_two.setAttribute("window", { tab, stream });
      container_two.setAttribute('rotation', {x: -90, y: 0, z: 0});
      

      marker.appendChild(container_two);
      markers.appendChild(marker);

/*       const video = document.createElement("video");
      video.width = 400;
      video.height = 200;
      video.srcObject = stream;
      video.play(); */
      // myTabs.appendChild(video);
    });
  }
});
