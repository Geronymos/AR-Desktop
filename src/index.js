import "aframe";
import "aframe-event-set-component";
import "super-hands";
import "aframe-physics-system/dist/aframe-physics-system";
import "aframe-physics-extras";

import * as dat from 'dat.gui';

import "./components/hand-pose-detection-controler";
// import "./mediapipe-pose";

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function main() {
    const gui = new dat.GUI();

    const hand = document.getElementById("leftHand");
    hand.emit("controllerconnected");
    const events = {
        'gripdown': () => hand.emit('gripdown'),
        'gripup': () => hand.emit('gripup'),
        'trackpaddown': () => hand.emit('trackpaddown'),
        'trackpadup': () => hand.emit('trackpadup'),
        'trackpadtouchstart': () => hand.emit('trackpadtouchstart'),
        'trackpadtouchend': () => hand.emit('trackpadtouchend'),
        'triggerdown': () => hand.emit('triggerdown'),
        'triggerup': () => hand.emit('triggerup'),
        'triggertouchstart': () => hand.emit('triggertouchstart'),
        'triggertouchend': () => hand.emit('triggertouchend'),
        'griptouchstart': () => hand.emit('griptouchstart'),
        'griptouchend': () => hand.emit('griptouchend'),
        'thumbstickdown': () => hand.emit('thumbstickdown'),
        'thumbstickup': () => hand.emit('thumbstickup'),
        'abuttontouchstart': () => hand.emit('abuttontouchstart'),
        'abuttontouchend': () => hand.emit('abuttontouchend'),
        'bbuttontouchstart': () => hand.emit('bbuttontouchstart'),
        'bbuttontouchend': () => hand.emit('bbuttontouchend'),
        'xbuttontouchstart': () => hand.emit('xbuttontouchstart'),
        'xbuttontouchend': () => hand.emit('xbuttontouchend'),
        'ybuttontouchstart': () => hand.emit('ybuttontouchstart'),
        'ybuttontouchend': () => hand.emit('ybuttontouchend'),
        'surfacetouchstart': () => hand.emit('surfacetouchstart'),
        'surfacetouchend': () => hand.emit('surfacetouchend')
    };
    for (event in events) {
        gui.add(events, event)
    }
}

ready(main);