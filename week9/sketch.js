// Contour-line sketch (p5.js, WEBGL mode)
// Needs p5.js 1.7+ (WebGL2 is the default there, which the shader relies on for fwidth).
//
// Paste into editor.p5js.org, or use with an index.html that loads p5.
// To use your own picture: upload it to the editor and set IMAGE_URL below,
// or just drag and drop an image onto the canvas.

const IMAGE_URL = 'bunny2.jpg'; // e.g. 'photo.jpg'. Leave empty for the generated default.

let contourShader;
let src;              // p5.Graphics that feeds the shader (grayscale "height map")
let userImg = null;
let cnv;

let hover = 0;
let mouseIn = false;
const mUV = { x: 0.5, y: 0.5 };
const smoothUV = { x: 0.5, y: 0.5 };

// particles (stored in clip space, -1..1, like the original)
const MAX_P = 400;
let pX, pY, pVX, pVY, pLife, pMaxLife, pCursor = 0;

const VERT = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec2 aTexCoord;
out vec2 vUv;
void main() {
  vUv = vec2(aTexCoord.x, 1.0 - aTexCoord.y); // y up, like the original
  gl_Position = vec4(aPosition.xy * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D tex;
uniform vec2 mouse;
uniform float hover;

float heightAt(vec2 uv) {
  float s = 0.0;
  float w = 0.0;
  for (int i = -3; i <= 3; i++) {
    for (int j = -3; j <= 3; j++) {
      vec2 o = vec2(float(i), float(j)) * 0.004;
      float k = exp(-float(i * i + j * j) / 6.0);
      // flip y: p5 textures have row 0 at the top
      vec3 c = texture(tex, vec2(uv.x, 1.0 - uv.y) + o).rgb;
      s += dot(c, vec3(0.299, 0.587, 0.114)) * k;
      w += k;
    }
  }
  return s / w;
}

void main() {
  vec2 uv = vUv;
  // stretch warp around mouse
  vec2 d = uv - mouse;
  float r = length(d);
  float f = exp(-r * r * 90.0);
  uv = mouse + d * (1.0 - 0.6 * hover * f);

  float h = heightAt(uv);
  float levels = 22.0;
  float v = h * levels;
  float fw = fwidth(v);
  float dist = abs(fract(v - 0.5) - 0.5) / max(fw, 1e-4); // pixel distance to isoline
  float thick = 1.6;
  float line = 1.0 - smoothstep(thick - 0.8, thick + 0.8, dist);

  vec3 bg = vec3(0.953, 0.937, 0.902);
  vec3 red = vec3(0.839, 0.125, 0.125);
  fragColor = vec4(mix(bg, red, line), 1.0);
}`;

function preload() {
  if (IMAGE_URL) userImg = loadImage(IMAGE_URL);
}

function setup() {
  cnv = createCanvas(600, 600, WEBGL);
  pixelDensity(min(window.devicePixelRatio || 1, 2));
  noStroke();

  contourShader = createShader(VERT, FRAG);

  src = createGraphics(width, height);
  src.pixelDensity(1);
  buildSource();

  pX = new Float32Array(MAX_P);
  pY = new Float32Array(MAX_P);
  pVX = new Float32Array(MAX_P);
  pVY = new Float32Array(MAX_P);
  pLife = new Float32Array(MAX_P);
  pMaxLife = new Float32Array(MAX_P).fill(1);

  cnv.drop(gotFile);
  cnv.elt.addEventListener('pointerleave', () => { mouseIn = false; });
}

// ---------- source image ----------
function buildSource() {
  src.resizeCanvas(width, height);
  src.background(0);
  if (userImg && userImg.width > 0) {
    // "cover" fit
    const sc = max(width / userImg.width, height / userImg.height);
    const dw = userImg.width * sc;
    const dh = userImg.height * sc;
    src.imageMode(CENTER);
    src.image(userImg, width / 2, height / 2, dw, dh);

  } else {
    drawDefault(src.drawingContext, width, height);
  }
}

function drawDefault(ctx, w, h) {
  const s = min(w, h);
  const blob = (x, y, r, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  blob(w * 0.5, h * 0.5, s * 0.42, 1);
  blob(w * 0.25, h * 0.3, s * 0.22, 0.8);
  blob(w * 0.78, h * 0.72, s * 0.26, 0.7);
  blob(w * 0.8, h * 0.22, s * 0.16, 0.6);
  blob(w * 0.2, h * 0.78, s * 0.14, 0.6);
}

function gotFile(file) {
  if (file.type === 'image') {
    userImg = loadImage(file.data, buildSource);
  }
}

// ---------- particles ----------
function spawnBurst(ux, uy) {
  const n = 80;
  for (let i = 0; i < n; i++) {
    const idx = pCursor;
    pCursor = (pCursor + 1) % MAX_P;
    const a = random(TWO_PI);
    const sp = 0.3 + random(1.2);
    pX[idx] = ux * 2 - 1;
    pY[idx] = uy * 2 - 1;
    pVX[idx] = cos(a) * sp;
    pVY[idx] = sin(a) * sp;
    pMaxLife[idx] = 0.6 + random(0.9);
    pLife[idx] = pMaxLife[idx];
  }
}

// ---------- input ----------
function updateMouse() {
  mouseIn = true;
  mUV.x = mouseX / width;
  mUV.y =  mouseY / height;
}

function mouseMoved() { updateMouse(); }
function mouseDragged() { updateMouse(); }
function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  updateMouse();
  spawnBurst(mUV.x, mUV.y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildSource();
}

// ---------- main loop ----------
function draw() {
  const dt = min(deltaTime, 100) * 0.001;
  const k = 1 - Math.exp(-dt * 6);
  hover += ((mouseIn ? 1 : 0) - hover) * k;
  smoothUV.x += (mUV.x - smoothUV.x) * k;
  smoothUV.y += (mUV.y - smoothUV.y) * k;

  // contour field
  shader(contourShader);
  contourShader.setUniform('tex', src);
  contourShader.setUniform('mouse', [smoothUV.x, smoothUV.y]);
  contourShader.setUniform('hover', hover);
  rect(0, 0, width, height);
  resetShader();

  // particles (WEBGL origin is the canvas centre, y points down)
  const gl = drawingContext;
  gl.disable(gl.DEPTH_TEST);
  stroke(214, 32, 32);
  strokeWeight(9);
  for (let i = 0; i < MAX_P; i++) {
    if (pLife[i] <= 0) continue;
    pLife[i] -= dt;
    pX[i] += pVX[i] * dt;
    pY[i] += pVY[i] * dt;
    pVX[i] *= 1 - dt * 1.2;
    pVY[i] *= 1 - dt * 1.2;
    if (pLife[i] > 0) point(pX[i] * width / 2, pY[i] * height / 2);
  }
  noStroke();
  gl.enable(gl.DEPTH_TEST);
}
