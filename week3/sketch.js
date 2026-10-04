// sleepy black technology click


let font1;


let letters = [];



 async function setup() {
  
  createCanvas(windowWidth, windowHeight);
 // angleMode(DEGREES);

  font1 = await loadFont("/week3/terminal-grotesque.ttf");
  


 
  
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

function windowResized(){

  resizeCanvas(windowWidth, windowHeight);
  
}
