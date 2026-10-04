class Letter{
  constructor(x, y){
    this.alphabets = ["e","l","p","s","y"];

    this.letter = random(this.alphabets);
    
    this.x = x;
    this.y = y;
    this.dx = (-20, 20);
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
  textFont("terminal-grotesque");
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