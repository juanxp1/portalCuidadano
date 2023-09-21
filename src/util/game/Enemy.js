import { Shot } from "./Shot";
import { Animation } from "./Animations";
const PI = 3.1415;
export class Enemy {
  constructor(sketch, ship, shots, animations, type) {
    this.ship = ship;
    this.shots = shots;
    this.animations = animations;
    this.sketch = sketch;
    this.type = type;

    if (this.type === 0) {
      this.color = "#FF4F54";
      this.travel = this.sketch.round(this.sketch.random(50, 150));
      this.radius = 22;
      this.speed = 2;
      this.health = 1;
      this.score = 50;
    } else if (this.type === 1) {
      this.color = "#ec407a";
      this.travel = this.sketch.round(this.sketch.random(100, 250));
      this.radius = 30;
      this.health = 2;
      this.speed = 0.6;
      this.score = 80;
    } else if (this.type === 2) {
      this.color = "#006064";
      this.travel = this.sketch.round(this.sketch.random(10, 40));
      this.radius = 20;
      this.health = 1;
      this.speed = 3.5;
      this.score = 110;
    } else if (this.type === 3) {
      this.color = "#FF8500";
      this.travel = this.sketch.round(this.sketch.random(10, 30));
      this.radius = 40;
      this.health = 4;
      this.speed = 0.3;
      this.score = 140;
    }

    this.startx = this.sketch.round(
      this.sketch.random(this.travel, this.sketch.width - this.travel)
    );
    this.position = this.sketch.createVector(this.startx, -10);
  }

  move() {
    if (this.type === 0) {
      this.position.y += this.speed;
      this.position.x =
        this.sketch.sin(0.01 * this.position.y) * this.travel + this.startx;
    } else if (this.type === 1) {
      this.position.y += this.speed;
      this.position.x =
        -this.sketch.sin(0.01 * this.position.y) * this.travel + this.startx;
      // pink pews
      if (this.sketch.random(360) < 2) {
        this.shots.push(
          new Shot(
            this.sketch,
            this.ship,
            this.position,
            PI / 2,
            this.color,
            "enemy"
          )
        );
      }
    } else if (this.type === 2) {
      this.position.y += this.speed;
      this.position.x =
        this.sketch.sin(0.01 * this.position.y) * this.travel + this.startx;
      if (this.sketch.random(280) < 2) {
        this.newX = this.sketch.constrain(
          this.position.x + this.sketch.random(-300, 300),
          this.travel,
          this.sketch.width - this.travel
        );
        this.newY = this.position.y - this.sketch.random(150, 250);
        this.animations.push(
          new Animation(this.sketch, this.ship, this, "teleportOut")
        );
        this.startx = this.newX;
        this.position.x = this.newX;
        this.position.y = this.newY;
      }
    } else if (this.type === 3) {
      this.position.y += this.speed;
      this.position.x =
        this.sketch.sin(0.01 * this.position.y) * this.travel + this.startx;
      if (this.sketch.random(420) < 2) {
        for (let i = 0; i < 8; i++) {
          this.shots.push(
            new Shot(
              this.sketch,
              this.ship,
              this.position,
              (i * PI) / 4,
              this.color,
              "blue"
            )
          );
        }
      }
    }
  }

  show() {
    this.sketch.push();
    this.sketch.fill(this.color);
    this.sketch.noStroke();

    this.sketch.ellipse(this.position.x, this.position.y, this.radius);

    this.sketch.pop();
  }
}
