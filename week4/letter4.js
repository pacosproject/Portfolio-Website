class Letter {
  constructor(x, y, scl) { // like a setup() function but for one object or created class
    this.pos = createVector(x, y); // attaching specific     behaviors/properties to instance
    this.scl = scl; // attaching specific behaviors/properties to instance
  }
  
  display() {
    this.calcVel(center, this.pos);
    this.shift = map(this.distance, 0, 100, 5, 0); // controls shape based on face tracking 
    this.osc = sin(TWO_PI*angle + this.shift);
    
    this.fontS = map(this.osc, -1, 1, 0.3, 1.5);
    push();
    translate(this.pos.x + (this.vel.x * this.osc), this.pos.y + (this.vel.y * this.osc)); 
    fill(255);
    // ellipse(0, 0, 10, 10);
    scale(this.fontS);
    textAlign(CENTER, CENTER);
    text("OPEN", 0, 0);
    pop();
  }

  // CUSTOM user defined function to control behavior of letters position and position while moving
  
  calcAngle() {
    let x = center.x - this.pos.x;
    let y = center.y - this.pos.y; 
    let theta = atan(y/x); // angle position of 0 - 360 degrees

    // if users face pos is moving have theta follow but also cycle through ripple like effect 

    if (this.pos.x > center.x && this.pos.y > center.y) {
      return theta;
    } else if (this.pos.x <= center.x && this.pos.y >= center.y) {
      return PI - abs(theta);
    } else if (this.pos.x <= center.x && this.pos.y <= center.y) {
      return PI + theta;
    } else if (this.pos.x >= center.x && this.pos.y <= center.y) {
      return TWO_PI - abs(theta);
    }
 
}

 calcVel() {
    let angle = this.calcAngle();
    this.vel = p5.Vector.fromAngle(angle);
    this.distance = dist(center.x, center.y, this.pos.x, this.pos.y);
    this.vel.setMag(this.distance * this.scl);
     //line(center.x, center.y, center.x + this.vel.x, center.y + this.vel.y);
  }

}