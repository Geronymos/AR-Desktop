import "aframe";
import "aframe-event-set-component";
/* import "super-hands";
import "aframe-physics-system/dist/aframe-physics-system";
import "aframe-physics-extras"; */

import "./components/video-background";
import "./components/browser";
import "ar.js";

window.addEventListener("arjs-video-loaded", e => document.querySelector("a-scene").setAttribute("video-background", "#arjs-video"));
// window.addEventListener("arjs-video-loaded", e => document.querySelector("a-scene").emit("arjsvideoloaded"));
