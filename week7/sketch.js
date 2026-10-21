let hotdogs = [];
let spacingX = 100;
let spacingY = 20;

loadFont("fonts/YoungSerif-Medium.woff2");


function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(26);
  textFont("font");
  // textStyle(ITALIC);
   textStyle(BOLD);
  createHotdogs();
}

function createHotdogs() {
  hotdogs = [];

  for (let y = spacingY / 2; y < height; y += spacingY) {
    for (let x = spacingX / 2; x < width; x += spacingX) {
      hotdogs.push({
        x: x,
        y: y,
        angle: 0,
        rotating: false
      });
    }
  }
}

function draw() {
  background(255);

  for (let h of hotdogs) {
    let hovering =
      mouseX > h.x - spacingX / 2 &&
      mouseX < h.x + spacingX / 2 &&
      mouseY > h.y - spacingY / 2 &&
      mouseY < h.y + spacingY / 2;

    if (hovering && !h.rotating) {
      h.rotating = true;
      
    }
  //  else  h.rotating = false;

    if (h.rotating) {
      h.angle += 0.01;

      if (h.angle >= TWO_PI -.01) {
        h.angle = 0;
        h.rotating = false;
      }
    }

    push();
    translate(h.x, h.y);
    rotate(h.angle );

    fill(255, 20, 0);
    noStroke();
    text("hotdog", 0, 0);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
