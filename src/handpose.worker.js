import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

// https://github.com/tensorflow/tfjs/tree/master/tfjs-backend-wasm/starter/webpack
import wasmSimdPath from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-simd.wasm';
import wasmSimdThreadedPath from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-threaded-simd.wasm';
import wasmPath from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm';

setWasmPaths({
    'tfjs-backend-wasm.wasm': wasmPath,
    'tfjs-backend-wasm-simd.wasm': wasmSimdPath,
    'tfjs-backend-wasm-threaded-simd.wasm': wasmSimdThreadedPath
});

let model;

// https://github.com/burnpiro/erdem.pl/blob/master/src/utils/get-prediction.worker.js

// https://itnext.io/making-tensorflowjs-work-faster-with-webworkers-c356157a9d42
async function init() {
    await tf.ready();
    // await tf.setBackend("webgl");
    console.log(tf.getBackend())
    model = await handpose.load();
}
init();
export async function predict(video) {
    if (!model) {
        await init();
    }

    const predictions = await model.estimateHands(video, true);
    return predictions;

}