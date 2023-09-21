const LIFE_LENGTH = 18;
const LIFE_WIDTH = 5.7;
export class PowerUp {
  constructor(sketch, type) {
    this.sketch = sketch;
    this.type = type;

    this.length = 29;
    this.corner = 0;
    this.position = sketch.createVector(
      this.sketch.random(50, this.sketch.width - 50),
      -10
    );
    this.speed = 2;
    this.color = "#00FF22";
  }
  move() {
    this.position.y += this.speed;

    if (this.sketch.frameCount % 30 === 0) {
      if (this.color === "#00FF22") {
        this.color = "#C7FF00";
      } else {
        this.color = "#00FF22";
      }
    }
  }
  show() {
    this.sketch.push();
    this.sketch.noFill();
    this.sketch.strokeWeight(3);
    this.sketch.stroke(this.color);
    this.sketch.rect(
      this.position.x,
      this.position.y,
      this.length,
      this.length,
      this.corner
    );
    this.sketch.pop();

    this.sketch.push();
    this.sketch.noStroke();
    this.sketch.fill(this.color);
    if (this.type === 0) {
      this.sketch.rect(this.position.x - 7, this.position.y, 3, 15, 3);
      this.sketch.rect(this.position.x, this.position.y, 3, 15, 3);
      this.sketch.rect(this.position.x + 7, this.position.y, 3, 15, 3);
    } else if (this.type === 1) {
      this.sketch.strokeWeight(1);
      this.sketch.stroke(this.color);
      this.sketch.triangle(
        this.position.x,
        this.position.y - 9,
        this.position.x - LIFE_WIDTH,
        this.position.y + LIFE_LENGTH - 9,
        this.position.x + LIFE_WIDTH,
        this.position.y + LIFE_LENGTH - 9
      );
    }
    this.sketch.pop();
  }
}
