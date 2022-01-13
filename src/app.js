//import { getOriginPrivateDirectory } from 'https://cdn.jsdelivr.net/npm/native-file-system-adapter/mod.js';
//const {getOriginPrivateDirectory} = await import('https://cdn.jsdelivr.net/npm/native-file-system-adapter/mod.js');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);
document.body.style.backgroundColor = 'black';

const width = 800;
const height = 80;

const pixelRatio = window.devicePixelRatio;
canvas.width = width * pixelRatio;
canvas.height = height * pixelRatio;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

//canvas.style.backgroundColor = 'blue';

const horizon = canvas.width / 2;
const yCenter = canvas.height / 2;
const diagonal = Math.sqrt(horizon * horizon + yCenter * yCenter);
function animate(time) {
  requestAnimationFrame(animate);

  const slowTime = time / 1_000;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let i = (y * canvas.width + x) * 4;
      let xd = Math.abs(x - horizon);
      let yd = Math.abs(y - yCenter);
      let distortion = (xd + Math.abs(y - yCenter)) / (horizon + yCenter);
      distortion = Math.sqrt(xd * xd + yd * yd) / diagonal;
      let d = xd * (1 - distortion * 0.0001);
      const alpha = (1 - distortion);
      pixels[i + 0] = alpha * Math.round((Math.sin(d * d + slowTime) + 1) / 2) * 255;
      pixels[i + 1] = alpha * Math.round((Math.cos(d * d + slowTime) + 1) / 2) * 255;
      pixels[i + 3] = 255;
      //pixels[i + 3] = (1 - distortion) * 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

requestAnimationFrame(animate);

let isRecording = false;
const recordButton = document.createElement('button');
recordButton.innerText = 'Record';
document.body.appendChild(recordButton);

const mediaRecorder = new MediaRecorder(canvas.captureStream(30), {
  mimeType: 'video/webm',
});

let chunks = [];
mediaRecorder.addEventListener('dataavailable', (event) => {
  chunks.push(event.data);
});

mediaRecorder.addEventListener('stop', (event) => {
  const blob = new Blob(chunks, {type: ''});
  chunks = [];

  window
    .showSaveFilePicker({
      suggestedName: 'video',
      types: [{accept: {'video/webm': ['.webm']}}],
    })
    .then(async (fileSystem) => {
      console.log('hi', fileSystem);

      const stream = await fileSystem.createWritable();
      stream.write(blob);
      stream.close();
    }, () => {
      // abort
    });
});

recordButton.addEventListener('click', () => {
  if (isRecording) {
    isRecording = false;
    mediaRecorder.stop();
    recordButton.innerText = 'Record';
  } else {
    isRecording = true;
    mediaRecorder.start();
    recordButton.innerText = 'Stop';
  }
});

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
