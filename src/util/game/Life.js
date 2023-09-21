const LIFE_LENGTH = 18;
const LIFE_WIDTH = 5.7;

export class Life {
  constructor(sketch, i) {
    this.sketch = sketch;
    this.position = sketch.createVector(
      i * 25 + 25 + LIFE_WIDTH,
      this.sketch.height - 5 - LIFE_LENGTH
    );
    this.color = "#FFFFFF";
  }

  show() {
    this.sketch.fill(this.color);
    this.sketch.stroke(this.color);
    this.sketch.strokeWeight(1);
    this.sketch.triangle(
      this.position.x,
      this.position.y,
      this.position.x - LIFE_WIDTH,
      this.position.y + LIFE_LENGTH,
      this.position.x + LIFE_WIDTH,
      this.position.y + LIFE_LENGTH
    );
  }
}
