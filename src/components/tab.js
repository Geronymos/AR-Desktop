import { registerComponent } from "aframe";

export default registerComponent('tab', {
    schema: {
        stream: {},
        tabSize: { type: 'vec2', default: { x: 1920, y: 1080 } }
    },
    init: function () {
        // maybe a layer would be faster: https://aframe.io/docs/1.1.0/components/layer.html#sidebar
        const elem = this.el;
        elem.setAttribute('geometry', { width: 16 / 9, height: 1 });
        this.video = document.createElement("video");
        this.videoInfo;
        this.texture;
    },
    update: function (oldData) {
        const elem = this.el;
        const self = this;
        const object3D = elem.object3D.children[0];
        const data = this.data;

        // set texture
        if (data.stream && (data.stream !== oldData.stream)) {
            // video element that holds the stream

            this.video.srcObject = data.stream;
            this.video.play();
            elem.setAttribute('material', { src: self.video, repeat: { x: 1, y: 1 } });
            // https://stackoverflow.com/questions/26076259/get-media-detailsresolution-and-frame-rate-from-mediastream-object
            this.videoInfo = data.stream.getVideoTracks()[0].getSettings();
            this.texture = object3D.material.map;

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