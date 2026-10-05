class Letter{
  constructor(x, y){
    this.alphabets = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",];

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
  textFont(myFont);
  textSize(this.size);
  fill(255);
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