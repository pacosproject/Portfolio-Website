const ROUND_LENGTH = 600; // duration in frames

let gameState = "waiting"; // "waiting" or "playing"
let roundStart;
let recording;
// recording layout
// [ {x, y}, {x, y}, ... ]

let guests;
let me;



/////////////////////////////////////////////////
// controls

// const controls = { up: false, down: false, left: false, right: false };

function keyPressed() {
  if (gameState === "waiting") {
    partyEmit("startRound");
  }

//   } else if (key ==
}

/////////////////////////////////////////////////
// setup

function preload() {
  partyConnect("wss://demoserver.p5party.org", "Code-History-1");
  me = partyLoadMyShared({ initialized: true });
  guests = partyLoadGuestShareds();
}

function setup() {
  createCanvas(600, 600);


  // sent when gameState === "waiting" and any client presses key
  partySubscribe("startRound", startRound);

  // choose spawn point and color based on number join order
  if (guests.length === 1) {
    me.spawnX = 100;
    me.spawnY = 100;
    me.color = "#b72818";
  }
  if (guests.length === 2) {
    me.spawnX = width - 100;
    me.spawnY = 100;
    me.color = "#ffa213";
  }
  if (guests.length === 3) {
    me.spawnX = 100;
    me.spawnY = height - 100;
    me.color = "#4b75ff";
  }
  if (guests.length === 4) {
    me.spawnX = width - 100;
    me.spawnY = height - 100;
    me.color = "#adeec5";
  }
  if (guests.length > 4) {
    me.spawnX = random(width);
    me.spawnY = random(height);
    me.color = random(["#b72818", "#ffa213", "#4b75ff", "#adeec5"]);
  }

  me.x = me.spawnX;
  me.y = me.spawnY;

  me.history = [];
  me.ready = true;
}

/////////////////////////////////////////////////
// game state

function startRound() {
  console.log("start round");

  // not start frame
  roundStart = frameCount;

  // throw away old recording, and start an new one
  recording = [];

  // reset avatar
  me.x = me.spawnX;
  me.y = me.spawnY;

  // change game state
  gameState = "playing";
}

function endRound() {
  console.log("end round");

  // add a copy of this round's recording to the history
  // slice returns a "shallow copy" of the array
  me.history.push(recording.slice());

  // change game state
  gameState = "waiting";
}

/////////////////////////////////////////////////
// game loop
function draw() {
  if (gameState === "waiting") {
    drawWaiting();
  }
  if (gameState === "playing") {
    updateGame();
    drawGame();
  }
}

function updateGame() {
  const speed = 5;
  if (keyIsDown(87) || keyIsDown(UP_ARROW))    me.y -= speed;  // W
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW))  me.y += speed;  // S
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW))  me.x -= speed;  // A
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) me.x += speed;  // D

  // keep the avatar on the canvas
  me.x = constrain(me.x, 0, width);
  me.y = constrain(me.y, 0, height);
  
  // record the current position
  recording.push({ x: me.x, y: me.y });

  if (frameCount - roundStart > ROUND_LENGTH) {
    endRound();
  
  }
}

function drawWaiting() {
  push();

  textFont("terminal-grotesque")
  textAlign(CENTER, CENTER);
  textSize(24);
  fill("white");

  background("#000000");
  text("PRESS ANY KEY TO START\n \n \n \n  MOVE WITH \n \n w    a    s    d \n \n up / down / left / right", width / 2, height / 2);
 
  

  pop();
}

function drawGame() {
  push();

  background("#c9c9c9");

  // draw all the ghosts
  for (const p of guests) {
    if (!p.ready) continue;
    for (const round of p.history) {
      const current_frame = frameCount - roundStart;
      if (!round[current_frame]) continue;
      drawGhost(round[current_frame], p.color);
    }
  }

  // draw all the avatars
  for (const p of guests) {
    if (!p.ready) continue;
    drawAvatar(p, p.color);
  }

  drawTimer();

  pop();
}

function drawTimer() {
  push();
  const timerWidth = map(frameCount - roundStart, 0, ROUND_LENGTH, width, 0);
  fill(0);
  noStroke();
  rect(0, height - 4, timerWidth, 4);
  pop();
}

function drawAvatar(a, c = "black") {
  push();
  fill(c);
  noStroke();
  rect(a.x, a.y, 20, 20);
  pop();
}

function drawGhost(a, c = "black") {
  push();
  stroke(c);
  noFill();
  rect(a.x, a.y, 20, 20);
  pop();
}