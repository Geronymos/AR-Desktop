import "aframe";
/* import "aframe-event-set-component";
import "super-hands";
import "aframe-physics-system/dist/aframe-physics-system";
import "aframe-physics-extras"; */

import "./components/video-background";
import "./components/browser";
import "ar.js";


function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function main() {
  var video = document.querySelector("#webcam");

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"} })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}

// ready(main);