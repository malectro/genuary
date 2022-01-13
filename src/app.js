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
function animate(time) {
  requestAnimationFrame(animate);

  const slowTime = time / 1_000;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let i = (y * canvas.width + x) * 4;
      let d = Math.abs(x - horizon);
      let distortion = (d + Math.abs(y - yCenter)) / (horizon + yCenter);
      let seed = Math.round((Math.cos(d * d + slowTime) + 1) / 2) * 255;
      pixels[i + 1] = seed;
      pixels[i + 0] = Math.round((Math.sin(d * d + slowTime) + 1) / 2) * 255
      pixels[i + 3] = (1 - distortion) * 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

requestAnimationFrame(animate);
