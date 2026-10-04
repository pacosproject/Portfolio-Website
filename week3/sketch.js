// sleepy black technology click


let font1;


let letters = [];

// function preload(){
// font[0] = loadFont("/fonts/terminal-grotesque.tff");

  
  
// }

 async function setup() {
  
  createCanvas(screenWidth, screenHeight);
  angleMode(DEGREES);

  font1 = await loadFont('/fonts/terminal-grotesque.ttf');
  


 
  
}

function draw() {
  background(0);

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
