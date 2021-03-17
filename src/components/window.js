import { registerComponent } from "aframe";
import "./tab";

export default registerComponent('window', {
    schema: {
        tab: {},
        stream: {}
    },
    init: function () {
    },

    update: function () {
        const plane = this.el;
        const self = this;

        const { tab, stream } = this.data;

        // const plane = document.createElement("a-plane");
        const textElem = document.createElement("a-text");

        plane.appendChild(textElem);
        // elem.appendChild(plane);

        plane.setAttribute('tab', { stream, tabSize: { x: tab.width, y: tab.height } });
        textElem.setAttribute("text", { value: `${tab.title}` });
        textElem.setAttribute("position", { x: 0, y: 1, z: 0 });

        // click event on plane gets executed in tab
        plane.addEventListener("click", function (e) { self.onMouse(tab, e) });
        plane.addEventListener("mousedown", function (e) { self.onMouse(tab, e) });
        plane.addEventListener("mouseup", function (e) { self.onMouse(tab, e) });

        // keyboard event gets executed in tab
        document.addEventListener("keydown", function (e) { self.onKey(tab, e) });
        document.addEventListener("keyup", function (e) { self.onKey(tab, e) });
        document.addEventListener("keypress", function (e) { self.onKey(tab, e) });

    },

    // process mouse event for execution
    onMouse: function (tab, e) {
        console.log(e);
        const position = e.detail.intersection.uv;

        // send click message with unified position (0 to 1) to tab
        chrome.tabs.sendMessage(tab.id, { action: "click", data: { type: e.type, ux: position.x, uy: 1 - position.y } })

    },

    // process keyboard event for execution
    onKey: function (tab, e) {
        
        var event = {
            key: e.key,
            type: e.type,
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

        chrome.tabs.sendMessage(tab.id, { action: "key", data: event });
    }

});