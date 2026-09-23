
let columns = 5;
let rows = 5;
let colSize;
let rowSize;


function setup() {
  
  createCanvas(500, 500);
 colSize = width/columns;
 rowSize = height/rows
  noStroke();
}

function draw() {
  background(176, 203, 255);
  
  for (let x=0; x<columns; x++){
    for (let y=0; y<rows; y++){
      circle(x*colSize + 50 , y*rowSize + 50, random(40));
      
 if (mouseIsPressed === true) {
    frameRate(18);
  // stroke(255, 80, 150);
  // strokeWeight(3);
  } else {
    frameRate(8);
   // noStroke();
  
      }    
    }
  }
}

function mousePressed() {
  stroke(0, 16, 166);
  strokeWeight(3);
 
}

function mouseReleased() {
  stroke(255);
  strokeWeight(3);
}