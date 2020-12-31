import { Hands } from "@mediapipe/hands/hands";
import { Camera } from "@mediapipe/camera_utils/camera_utils";


function main() {
    const videoElement = document.getElementById("tensor");
    
    function onResults(results) {
        console.log(results);
        // results.multiHandLandmarks
    }
    
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    hands.setOptions({
        maxNumHands: 2,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);
    
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720
    });
    camera.start();
}

setTimeout(main, 1000);