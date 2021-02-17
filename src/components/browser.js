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
    plane.setAttribute('tab', { stream: self.background.captures[0].stream });


    // click event on plane gets executed in tab
    elem.addEventListener("click", onmouse);
    elem.addEventListener("mousedown", onmouse);
    elem.addEventListener("mouseup", onmouse);

    // keyboard event gets executed in tab
    document.addEventListener("keydown", onkey);
    document.addEventListener("keyup", onkey);
    document.addEventListener("keypress", onkey);

    // process mouse event for execution
    function onmouse(e) {
      const position = e.detail.intersection.uv;

      chrome.tabs.executeScript(self.tabs[0].id, {
        code: `(${click})("${e.type}", ${position.x} * window.innerWidth, ${1 - position.y} * window.innerHeight)`
      })
    }

    // click on an element on position x,y at position x, y
    // https://stackoverflow.com/questions/3277369/how-to-simulate-a-click-by-using-x-y-coordinates-in-javascript
    function click(type, x, y) {
      var ev = new MouseEvent(type, {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'clientX': x,
        'clientY': y
      });

      var el = document.elementFromPoint(x, y);
      console.log(el); //print element to console
      el.dispatchEvent(ev);
      el.focus();
    }

    // process keyboard event for execution
    function onkey(e) {
      var event = {
        key: e.key,
        code: e.code,
        location: e.location,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        repreat: e.repeat,
        isCompositing: e.isComposing,
        charCode: e.charCode,
        keyCode: e.keyCode,
        which: e.which
      };

      chrome.tabs.executeScript(self.tabs[0].id, {
        code: `(${key})("${e.type}", ${JSON.stringify(event)})`
      });
    }

    
    function key(type, event) {
      // more evnts for forms, input-fields and text-fields
      // https://stackoverflow.com/questions/4158847/how-to-simulate-key-presses-or-a-click-with-javascript
      var ev = new KeyboardEvent(type, event);
      console.log(event, ev);
      document.querySelectorAll("*").forEach(elem => elem.dispatchEvent(ev));

      if (type == "keydown") {
        // insertText deleteContentBackward insertFromPaste formatBold
        // https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes

        const active = document.activeElement;
        switch (ev.key) {
          case "Enter": ev.shiftKey ? active.value += "\n" : active.form?.submit(); break;
          case "Backspace": active.value = active.value.slice(0, -1); break;
          default: (ev.key.length == 1) && (active.value += ev.key);
        }
        /*   var input = new InputEvent("input", {
            'bubbles': true,
            'cancelable': true,
            "inputType": ev.key == "Backspace" ? "deleteContentBackward" : "insertText",
            "data": ev.key.length == 1 ? ev.key : undefined
          });
          document.activeElement.dispatchEvent(input); */
        // active.dispatchEvent(new Event("input"));
        // active.dispatchEvent(new Event("change"));
      }
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
