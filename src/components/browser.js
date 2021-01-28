import { registerComponent } from "aframe";
// import { VideoTexture } from "aframe/src/lib/three";
// import { VideoTexture } from "three";

export default registerComponent('browser', {
  schema: {
  },
  init: function () {
    this.background = chrome.extension.getBackgroundPage();
    this.bg_video = this.background.document.querySelector("video");
  },
  update: function () {
    const elem = this.el;
    const self = this;

    const video = document.createElement("video");
    video.srcObject = self.bg_video.srcObject;
    video.play();

    const plane = document.createElement("a-plane");
    elem.appendChild(plane);
    plane.setAttribute('height', 1);
    plane.setAttribute('width', 16/9);
    plane.setAttribute('material', { src: video });

  }
});
