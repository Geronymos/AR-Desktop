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

        const {tab, stream} = this.data;

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

        chrome.tabs.executeScript(tab.id, { code: `(${self.onResize})()` });

    },

    remove: function () {

    },

    // function for each captures tab that messages the new resolution
    onResize: function () {
        window.addEventListener("resize", function (e) {
            chrome.runtime.sendMessage({ action: "resize", width: window.innerWidth, height: window.innerHeight })
        })
    },

    // process mouse event for execution
    onMouse: function (tab, e) {
        const position = e.detail.intersection.uv;

        chrome.tabs.executeScript(tab.id, {
            code: `(${click})("${e.type}", ${position.x} * window.innerWidth, ${1 - position.y} * window.innerHeight)`
        });

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
    },

    // process keyboard event for execution
    onKey: function (tab, e) {
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

        chrome.tabs.executeScript(tab.id, {
            code: `(${key})("${e.type}", ${JSON.stringify(event)})`
        });

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
            }
        }
    }

});