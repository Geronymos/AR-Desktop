import * as THREE from 'three';
import * as Stats from 'stats.js';
import { VideoTexture, ImageTexture } from 'three';

// import "ar.js";

// window.addEventListener("arjs-video-loaded", e => document.querySelector("a-scene").setAttribute("video-background", "#arjs-video"));
// window.addEventListener("arjs-video-loaded", e => document.querySelector("a-scene").emit("arjsvideoloaded"));

let scene, camera, renderer;

let cube, loader;

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

init();


async function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js

    loader = new THREE.TextureLoader();

    const geometry = new THREE.PlaneGeometry(5, 3);
    const material = new THREE.MeshBasicMaterial({ map: new THREE.Texture() });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const videoElem = await getMedia();
    scene.background = new VideoTexture(videoElem);
    window.addEventListener('resize', onWindowResize);
    let stream = null;
    camera.position.z = 5;
    updateTexture()

}



async function getMedia() {
    let videoElem = document.createElement("video");

    const constraints = { video: { facingMode: "environment" } };

    try {
        /* use the stream */
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElem.srcObject = stream;
        videoElem.play();

        return videoElem;

    } catch (err) {
        /* handle the error */
        console.log(err);
        return undefined;
    }
}

function updateTexture() {
    // while (true) {
    browser.tabs.captureVisibleTab().then(url => {
        loader.load(url, async texture => {
            cube.material.map = texture;
            cube.material.map.needsUpdate = true;
            console.log("Changed texture");
            // cube.material.needsUpdate = true;
            // await updateTexture();
        }, () => 0, err => console.log(err));
        updateTexture();
    }).catch(err => {
        console.log(err);
        updateTexture();
    });

    // }
}

function animate() {
    requestAnimationFrame(animate);

    /*     cube.rotation.x += 0.01;
        cube.rotation.y += 0.01; */

    render();
};

function render() {
    renderer.render(scene, camera);
    stats.update();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

animate();