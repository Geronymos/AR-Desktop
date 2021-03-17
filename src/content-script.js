chrome.runtime.onMessage.addListener(function (message, sender, response) {
    console.log(message);
    const {action, data} = message;
    switch (action) {
        case "click":
            click(data.type, data.ux * window.innerWidth, data.uy * window.innerHeight);
            break;
        case "key":
            key(data.type, data);
            break;
    }
});
console.log("Hello from the other side!");
window.addEventListener("resize", function (e) {
    chrome.runtime.sendMessage({ action: "resize", width: window.innerWidth, height: window.innerHeight })
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