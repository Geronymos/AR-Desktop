# AR-Desktop

AR-Desktop.

Built with [A-Frame](https://aframe.io).

## Setup

```sh
npm install
npm run start
```


https://www.npmjs.com/package/web2vr !!!!!
https://www.npmjs.com/package/aframe-arjs-vr
https://www.npmjs.com/package/aframe-html
https://www.npmjs.com/package/aframe-html-shader



https://developer.chrome.com/docs/extensions/reference/tabCapture/
https://developer.chrome.com/docs/extensions/reference/desktopCapture/

https://github.com/mozilla/webextension-polyfill#installation



function captureTab() {
    var constraints = {
        audio: true,
        video: true,
        videoConstraints: {
            mandatory: {
                chromeMediaSource: 'tab',
 /*                minWidth: 1920,
                maxWidth: 1920,
                minHeight: 1080,
                maxHeight: 1080 */
            }
        }
    };

    chrome.tabCapture.capture(constraints, function (stream) {
        if (stream === null) {
            console.log(`Last Error: ${chrome.runtime.lastError.message}`);
            return;
        }
        // p.src = stream;
        const elem = document.createElement('video');
        document.body.appendChild(elem);
        elem.autoplay = true;
        elem.srcObject = stream;
        elem.play();

    });
}


  const background = chrome.extension.getBackgroundPage();
  const bg_video = background.document.querySelector("video");

  video.srcObject = bg_video.srcObject;

  <a-video src="#webcam" width="3" height="1.5" position="0 2 -3"></a-video>