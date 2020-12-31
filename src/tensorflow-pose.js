const handpose = require('@tensorflow-models/handpose');
// Import @tensorflow/tfjs or @tensorflow/tfjs-core
const tf = require('@tensorflow/tfjs');
import { Camera } from "@mediapipe/camera_utils/camera_utils";
// Add the WASM backend to the global backend registry.
/* import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';

import wasmSimdPath from '../node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-simd.wasm';
import wasmSimdThreadedPath from '../node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-threaded-simd.wasm';
import wasmPath from '../node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm';

setWasmPaths({
  'tfjs-backend-wasm.wasm': wasmPath,
  'tfjs-backend-wasm-simd.wasm': wasmSimdPath,
  'tfjs-backend-wasm-threaded-simd.wasm': wasmSimdThreadedPath
}); */

// require('@tensorflow/tfjs-backend-webgl'); // handpose does not itself require a backend, so you must explicitly install one.

// https://www.npmjs.com/package/@mediapipe/hands

async function predict(model, video) {
    const predictions = await model.estimateHands(video);
    console.log("hi", predictions)

    if (predictions.length > 0) {

        const hand = predictions[0].annotations;
        for (let finger of ['thumb','indexFinger','middleFinger','ringFinger','pinky']) {
            //console.log(finger)
            const elem = document.getElementById(finger);
            //console.log(elem);
            for (let i = 0; i < 3; i++) {
                const segment_start = hand[finger][i];
                const segment_end = hand[finger][i + 1];

                elem.setAttribute(`line__${i}`, {
                    start: { x: segment_start[0]/100, y: segment_start[1]/100, z: segment_start[2]/100 },
                    end: { x: segment_end[0]/100, y: segment_end[1]/100, z: segment_end[2]/100 },
                });
            }
        }

    }

}

async function main() {
    const videoElement = document.getElementById("tensor");

    // Load the MediaPipe handpose model.
    await tf.ready();
    const model = await handpose.load();
    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
    // hand prediction from the MediaPipe graph.


    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await predict(model, videoElement);
        },
        width: 1280,
        height: 720
    });
    camera.start();

}

// main();
setTimeout(main, 1000);
// tf.setBackend('wasm').then(() => main());