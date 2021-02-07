import { registerComponent } from "aframe";
import "./tab";
// import { VideoTexture } from "aframe/src/lib/three";
// import { VideoTexture } from "three";

export default registerComponent('browser', {
  schema: {
  },
  init: function () {
    this.background = chrome.extension.getBackgroundPage();
    this.tabs = [];
  },
  update: function () {
    const elem = this.el;
    const self = this;

    // 3d plane that shows the video element
    const plane = document.createElement("a-plane");
    elem.appendChild(plane);
    plane.setAttribute('tab', { stream: self.background.streams[0] });


    // click event on plane gets executed in tab
    elem.addEventListener("click", function (e) {
      const position = e.detail.intersection.uv;
      console.log("Clicked!", position);

      chrome.tabs.executeScript(self.tabs[0].id, {
        code: `(${click})(${position.x} * window.innerWidth, ${1 - position.y} * window.innerHeight)`
      })
    });

    // click on an element on position x,y at position x, y
    // https://stackoverflow.com/questions/3277369/how-to-simulate-a-click-by-using-x-y-coordinates-in-javascript
    function click(x, y) {
      var ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'clientX': x,
        'clientY': y
      });

      var el = document.elementFromPoint(x, y);
      console.log(el); //print element to console
      el.dispatchEvent(ev);
    }

    // get resolution
    chrome.tabCapture.getCapturedTabs(function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.get(tab.tabId, function (tab) {
          plane.setAttribute('tab', { tabSize: { x: tab.width, y: tab.height } });
          self.tabs.push(tab);
        });
        // https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content
        chrome.tabs.executeScript(tab.tabId, { code: `(${onresize})()` })
      })
    })

    // listen for messages with new resolution
    chrome.runtime.onMessage.addListener(function (message, sender, response) {
      plane.setAttribute('tab', { tabSize: { x: message.width, y: message.height } });
    });

    // function for each captures tab that messages the new resolution
    function onresize() {
      window.addEventListener("resize", function (e) {
        chrome.runtime.sendMessage({ width: window.innerWidth, height: window.innerHeight })
      })
    }

  }
});
