// Camouflaged Messages Sketch // 
 
let textbox, cancelBtn, submitBtn, cnv;
let letters = [], particles = [];
let scene = false;    // false = idle background, true = sentence falling
let flash = 0;          // white flash that plays when the scene refreshes

 
function setup() {
  cnv = createCanvas(600, 600);
  textFont('monospace');
  textAlign(CENTER, BASELINE);
  makeParticles();
 
  // controls sit on top of the canvas, near the bottom
  const left = cnv.elt.offsetLeft, top = cnv.elt.offsetTop;
  textbox = createInput('');
  textbox.size(300);
  textbox.attribute('placeholder', 'Type here...');
  textbox.attribute('maxlength', '140');
  textbox.position(left + 50, top + height - 55);
  cancelBtn = createButton('Cancel');
  cancelBtn.position(left + 380, top + height - 55);
  cancelBtn.mousePressed(() => textbox.value(''));
  submitBtn = createButton('Submit');
  submitBtn.position(left + 455, top + height - 55);
  submitBtn.mousePressed(startScene);
  for (const el of [textbox, cancelBtn, submitBtn]) {
    el.style('background', 'rgba(0,0,0,0.75)');
    el.style('color', '#fff');
    el.style('border', '1px solid #888');
    el.style('padding', '6px 10px');
  }

 const base = {
    'background': 'rgba(0,0,0,0.75)',
    'color': '#fff',
    'border': '1px solid #888',
    'padding': '6px 10px',
    'margin': '0',
    'box-sizing': 'border-box',
    'font-family': 'monospace',
    'font-size': '14px',
    'line-height': '1',
    'height': '32px'
  };
  styleEl(textbox,   { ...base, 'width': '300px' });
  styleEl(cancelBtn, { ...base, 'width': '71px' });
  styleEl(submitBtn, { ...base, 'width': '71px' });


}
 
function styleEl(el, rules) {
  for (const [prop, value] of Object.entries(rules)) {
    el.elt.style.setProperty(prop, value, 'important');
  }
}

function keyPressed() {
  if (keyCode === ENTER && !scene) startScene();
}
 
function makeParticles() {
  particles = [];
  for (let i = 0; i < 240; i++) particles.push(new Particle());
}
 
function startScene() {
  const chars = [...textbox.value().toLowerCase()].filter(c => c.trim() !== '');
  if (chars.length === 0) return;
 
  textbox.hide(); cancelBtn.hide(); submitBtn.hide();
  makeParticles();          // refresh the background

 
  // lay the sentence out in rows above the top of the canvas, then let it fall in
  
  const fallsteps = 20;
  const perRow = floor((width - 40) / fallsteps);
  letters = chars.map((c, i) => {
    const inRow = min(perRow, chars.length - floor(i / perRow) * perRow);
    const x = width / 2 + ((i % perRow) - (inRow - 1) / 2) * fallsteps;
    return new Letter(c, x, -20 - floor(i / perRow) * 30 - random(120));
  });
  scene = true;
}
 
function draw() {
  background(0);
 
  for (const l of letters) l.update();
  for (const l of letters) { if (!l.isFresh()) l.display(); }   // older letters sit under the particles
  for (const p of particles) { p.update(); p.display(); }       // so they get camouflaged
  for (const l of letters) { if (l.isFresh()) l.display(); }    // fresh letters sit on top so they can be read
  letters = letters.filter(l => !l.offScreen());
 
  if (flash > 0) {                                        // the refresh flash
    noStroke();
    fill(255, flash);
    rect(0, 0, width, height);
    flash -= 12;
  }
 
  if (scene && letters.length === 0) {                    // all gone: back to idle
    scene = false;
    textbox.value('');
    textbox.show(); cancelBtn.show(); submitBtn.show();
    makeParticles(); 
  }
}
 
class Letter {
  constructor(ch, x, y) {
    this.letter = ch;
    this.x = x;
    this.y = y;
    this.dx = random(-0.3, 0.3);
    this.dy = random(0.6, 1.4);      // fall speed
    this.size = random(24, 28);
    this.alpha = random(200, 240);
    this.age = 0;                    // frames spent on screen
  }

//==== cntrls secondary "page" after txt sumbit ====
  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 14 || this.x > width - 14) {   // bounce off the canvas walls
      this.dx *= -1;
      this.x = constrain(this.x, 14, width - 14);
    }
    if (this.y > 0) this.age++;
  }
  // a letter stays bright and on top for its first couple of seconds on screen, then blends in
  isFresh() {
    return this.age < 120;
  }
  display() {
    const shown = this.alpha + (255 - this.alpha) * max(0, 1 - this.age / 120);
    noStroke();
    fill(255);     // Written text color
    textSize(this.size);
    text(this.letter, this.x, this.y);
  }
  offScreen() {
    return this.y > height + this.size * 2;
  }
}
 
// Camouflage: same colour, similar size and speed as the letters
class Particle {
  constructor() {
    this.glyph = random() < 0.5 ? char(97 + floor(random(26))) : null;
    this.size = this.glyph ? random(8, 24) : random(1.5, 4);
    this.x = random(width);
    this.y = random(-40, height);
    this.dx = random(-0.4, 0.4);
    this.dy = random(0.5, 1.6);
    this.alpha = random(90, 10);
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.y > height + 30) { this.y = -30; this.x = random(width); }
    if (this.x < -30) this.x = width + 30;
    if (this.x > width + 30) this.x = -30;
  }
 
  display() {
   
    noStroke();
    fill(255, this.alpha);
    if (this.glyph) { textSize(this.size); text(this.glyph, this.x, this.y); }
   
   
  }
}
 