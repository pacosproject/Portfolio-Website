// sleepy black technology click



class Letter{
  constructor(x, y){
    this.alphabets = ["e", "l", "s", "p", "y"];

    this.letter = random(this.alphabets);
    
    this.x = x;
    this.y = y;
    this.dx = (-8, 8); // speed of letters produced
    this.dy = (-1, 1);
     
   // this.angle = random(360);
    
  }

update(){

  this.x == this.dx;
  this.y += this.dy;
  this.size = 100;
}
  
 display(){
  push();
   
  translate(this.x, this.y); // 
  rotate(this.angle);
  textFont(font1);
  textSize(this.size);
  fill(0);
  noStroke();
  text(this.letter, 0, 0);
  pop();
   
 }

  offScreen(){

let margin = this.size * 2;  
if (this.x > width + margin || this.x<0 || this.y > height + margin|| this.y<0 - margin){
  return true;

} else {
  return false;
    }
     
  }
  
}





let font1;


let letters = [];

// function preload(){
// font[0] = loadFont("/fonts/terminal-grotesque.tff");

  
  
// }

 async function setup() {
  
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  font1 = await loadFont('/fonts/terminal-grotesque.ttf');
  


 
  
}

function draw() {
  background(255);

for (let i = letters.length - 1; i >= 0; i--){
letters[i].update();
letters[i].display();

if (letters[i].offScreen() == true){
 letters.splice(i, 1);
  
}
  
}

  // print(letters.length); // test if letters are being removed after exiting canvas bounds

}

function keyPressed(){
letters.push(new Letter(mouseX, mouseY));


}


