import { registerComponent } from "aframe";
// import { VideoTexture } from "three";

export default registerComponent('video-background', {
  schema: { type: 'selector', default: '#arjs-video'
  },
  init: function() {

  },
  update: function () {
    const data = this.data;
    const video = data;

    const self = this;

    this.isVR = false;

    console.log("Video:", video);
    if (!video) return;
    console.log("Settings video-background!", video);
    video.addEventListener('loadeddata', function () {
      self.setBackground(this);
    });

    document.querySelector('a-scene').addEventListener('enter-vr', function () {
      self.isVR = true;
    });

    document.querySelector('a-scene').addEventListener('enter-vr', function () {
      console.log("ENTERED VR");
    });

  },

  setBackground: function (video) {
    var object3D = this.el.object3D;

    const videoTexture = new THREE.VideoTexture(video);

    videoTexture.mapping = THREE.CubeReflectionMapping;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;

    console.log(video.videoWidth, video.videoHeight);

    videoTexture.repeat.set((video.videoWidth / video.videoHeight) / 2, 1);
    // videoTexture.repeat.set( window.innerWidth/window.innerHeight, 1 );
    videoTexture.offset.set((videoTexture.repeat.x - 1) / 2 * -1, 0);
    videoTexture.needsUpdate = true;

    object3D.background = videoTexture;
  }
});
