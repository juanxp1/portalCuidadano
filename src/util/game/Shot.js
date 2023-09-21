import p5 from "./p5.min";
const PLAYER_SHOT_SPEED = 8;
const ENEMY_SHOT_SPEED = 4;
const BLUE_SHOT_SPEED = 3;
const SHIP_LENGTH = 45;

export class Shot {
  constructor(sketch, ship, spot, angle, color, side) {
    this.sketch = sketch;
    this.side = side;
    this.position = this.sketch.createVector(spot.x, spot.y);
    this.size = 5;
    this.color = color;
    if (this.side === "enemy") {
      let dx = ship.position.x - spot.x;
      let dy = ship.position.y - spot.y + SHIP_LENGTH / 2;
      angle = this.sketch.atan2(dy, dx);
      this.speed = ENEMY_SHOT_SPEED;
    } else if (this.side === "player") {
      this.speed = PLAYER_SHOT_SPEED;
    } else if (this.side === "blue") {
      this.speed = BLUE_SHOT_SPEED;
    }
    let tempVel = p5.Vector.fromAngle(angle);
    this.velocity = tempVel.mult(this.speed);
  }

  show() {
    this.sketch.push();
    this.sketch.stroke(this.color);
    this.sketch.strokeWeight(this.size);
    this.sketch.point(this.position.x, this.position.y);
    this.sketch.pop();
  }

  move() {
    this.position.add(this.velocity);
  }
}
