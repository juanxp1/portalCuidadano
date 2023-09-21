import { Shot } from "@/util/game/Shot";
const SHIP_LENGTH = 45;
const SHIP_WIDTH = 14;
const PI = 3.1415;

export class Ship {
  constructor(sketch) {
    this.sketch = sketch;
    this.position = sketch.createVector(sketch.width / 2, sketch.height - 250);
    this.speed = 5;
    this.radius = 20;
    this.color = "#FFFFFF";
    this.shotRate = 220;
  }

  show() {
    this.sketch.fill(this.color);
    this.sketch.stroke(this.color);
    this.sketch.strokeWeight(1);
    this.sketch.triangle(
      this.position.x,
      this.position.y,
      this.position.x - SHIP_WIDTH,
      this.position.y + SHIP_LENGTH,
      this.position.x + SHIP_WIDTH,
      this.position.y + SHIP_LENGTH
    );
  }

  move() {
    if (this.sketch.keyIsDown(this.sketch.LEFT_ARROW))
      this.position.x = this.sketch.constrain(
        this.position.x - this.speed,
        0 + SHIP_WIDTH,
        this.sketch.width - SHIP_WIDTH
      );
    if (this.sketch.keyIsDown(this.sketch.RIGHT_ARROW))
      this.position.x = this.sketch.constrain(
        this.position.x + this.speed,
        0 + SHIP_WIDTH,
        this.sketch.width - SHIP_WIDTH
      );
    if (this.sketch.keyIsDown(this.sketch.UP_ARROW))
      this.position.y = this.sketch.constrain(
        this.position.y - this.speed,
        0,
        this.sketch.height - SHIP_LENGTH
      );
    if (this.sketch.keyIsDown(this.sketch.DOWN_ARROW))
      this.position.y = this.sketch.constrain(
        this.position.y + this.speed,
        0,
        this.sketch.height - SHIP_LENGTH
      );
  }

  shoot(ship, shots) {
    shots.push(
      new Shot(this.sketch, ship, this.position, -PI / 2, this.color, "player")
    );
    if (this.shotRate < 220) {
      shots.push(
        new Shot(
          this.sketch,
          ship,
          this.position,
          (-2 * PI) / 5,
          this.color,
          "player"
        )
      );
      shots.push(
        new Shot(
          this.sketch,
          ship,
          this.position,
          (-3 * PI) / 5,
          this.color,
          "player"
        )
      );
    }
    const that = this;
    setTimeout(function () {
      if (that.sketch.keyIsDown(32)) that.shoot(ship, shots);
    }, that.shotRate);
  }
}
