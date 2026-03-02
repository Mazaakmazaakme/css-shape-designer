const controls = {
  pointCount: document.getElementById('pointCount'),
  shapeSize: document.getElementById('shapeSize'),
  rotation: document.getElementById('rotation'),
  skew: document.getElementById('skew'),
  shadow: document.getElementById('shadow'),
  colorA: document.getElementById('colorA'),
  colorB: document.getElementById('colorB'),
  noise: document.getElementById('noise')
};

const shape = document.getElementById('shape');
const cssOutput = document.getElementById('cssOutput');
const pointCountValue = document.getElementById('pointCountValue');
const noiseValue = document.getElementById('noiseValue');

const state = {
  seed: Math.random()
};

function makePolygonPoints(points, noisePercent) {
  const radius = 45;
  const center = 50;
  const noise = noisePercent / 100;
  const coords = [];

  for (let i = 0; i < points; i += 1) {
    const angle = (Math.PI * 2 * i) / points - Math.PI / 2;
    const wave = Math.sin(i * 1.7 + state.seed * 10) * noise * 20;
    const localRadius = radius + wave;
    const x = center + Math.cos(angle) * localRadius;
    const y = center + Math.sin(angle) * localRadius;
    coords.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }

  return `polygon(${coords.join(', ')})`;
}

function render() {
  const pointCount = Number(controls.pointCount.value);
  const size = Number(controls.shapeSize.value);
  const rotation = Number(controls.rotation.value);
  const skew = Number(controls.skew.value);
  const shadow = Number(controls.shadow.value);
  const noise = Number(controls.noise.value);
  const colorA = controls.colorA.value;
  const colorB = controls.colorB.value;

  pointCountValue.textContent = pointCount;
  noiseValue.textContent = noise;

  const clipPath = makePolygonPoints(pointCount, noise);
  const css = {
    width: `${size}px`,
    height: `${size}px`,
    background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
    'clip-path': clipPath,
    transform: `rotate(${rotation}deg) skew(${skew}deg)`,
    'box-shadow': `0 ${Math.round(shadow * 0.6)}px ${shadow}px rgba(0, 0, 0, 0.45)`
  };

  Object.entries(css).forEach(([key, value]) => {
    shape.style.setProperty(key, value);
  });

  cssOutput.textContent = `.shape {\n  width: ${css.width};\n  height: ${css.height};\n  background: ${css.background};\n  clip-path: ${css['clip-path']};\n  transform: ${css.transform};\n  box-shadow: ${css['box-shadow']};\n}`;
}

Object.values(controls).forEach((element) => {
  element.addEventListener('input', render);
});

document.getElementById('randomizeBtn').addEventListener('click', () => {
  controls.pointCount.value = String(Math.floor(Math.random() * 8) + 4);
  controls.shapeSize.value = String(Math.floor(Math.random() * 160) + 140);
  controls.rotation.value = String(Math.floor(Math.random() * 360));
  controls.skew.value = String(Math.floor(Math.random() * 50) - 25);
  controls.shadow.value = String(Math.floor(Math.random() * 45) + 5);
  controls.noise.value = String(Math.floor(Math.random() * 30));
  controls.colorA.value = `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
  controls.colorB.value = `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
  state.seed = Math.random();
  render();
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(cssOutput.textContent);
    const button = document.getElementById('copyBtn');
    const original = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = original;
    }, 900);
  } catch {
    alert('Clipboard is unavailable in this environment.');
  }
});

render();
