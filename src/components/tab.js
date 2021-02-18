import { registerComponent } from "aframe";

export default registerComponent('tab', {
    schema: {
        stream: {},
        tabSize: { type: 'vec2', default: { x: 1920, y: 1080 } }
    },
    init: function () {
        // maybe a layer would be faster: https://aframe.io/docs/1.1.0/components/layer.html#sidebar
        // const elem = this.el;

    },
    update: function (oldData) {
        var elem = this.el;
        var self = this;
        var object3D = elem.getObject3D('mesh');
        var data = this.data;

        elem.setAttribute('geometry', { width: 16 / 9, height: 1 });
        this.video = document.createElement("video");
/*         const myTabs = document.getElementById("tabs");
        this.video.width = 400;
        this.video.height = 200;
        myTabs.appendChild(this.video); */
        this.videoInfo;
        this.texture;

        // set texture
        if (data.stream ) {
            // video element that holds the stream

            this.video.srcObject = data.stream;
            this.video.play();
            // elem.setAttribute('material', { src: this.video, repeat: { x: 1, y: 1 } });
            object3D.material.map = new THREE.VideoTexture( this.video );
            // https://stackoverflow.com/questions/26076259/get-media-detailsresolution-and-frame-rate-from-mediastream-object
            this.videoInfo = data.stream.getVideoTracks()[0].getSettings();
            this.texture = object3D.material.map;
            console.log(object3D);
            this.texture.center.set(0.5, 0.5);

        }

        // set aspect ratio and size
        if (data.stream && data.tabSize) {

            // https://stackoverflow.com/questions/32187035/three-js-make-image-texture-fit-object-without-distorting-or-repeating
            // texture.repeat.x = (tabSize.width / videoSize.width) / (tabSize.height / videoSize.height);
            this.texture.repeat.set(
                Math.min((data.tabSize.x * this.videoInfo.height) / (data.tabSize.y * this.videoInfo.width), 1),
                Math.min((data.tabSize.y * this.videoInfo.width) / (data.tabSize.x * this.videoInfo.height), 1)
            );

            // maybe scale would be better for supporting other geometries
            elem.setAttribute('geometry', { width: data.tabSize.x / data.tabSize.y, height: 1 });

            // texture.needsUpdate = true;
        }

    }
});