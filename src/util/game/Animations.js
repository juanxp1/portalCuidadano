import { Sound } from "@/util/game/Sound";

const PI = 3.1415;
const SHIP_LENGTH = 45;
const SHIP_WIDTH = 14;
const SHIP_RATIO = 3.21428571;
export class Animation {
  constructor(sketch, ship, obj, type) {
    this.sketch = sketch;
    this.ship = ship;
    this.position = this.sketch.createVector(obj.position.x, obj.position.y);
    this.type = type;
    this.timer = 0;
    this.sound = null;

    if (this.type === "death" || this.type === "playerDeath") {
      if (this.type === "playerDeath") {
        this.sound = document.getElementById("explode");
        if (this.sound) {
          this.sound.play();
        }
      }
      this.color = obj.color;
      this.thickness = 0;
      this.radius = 0;
    } else if (this.type === "damage") {
      this.color = "#FFFFFF";
      this.radius = obj.radius;
      this.travel = obj.travel;
      if (obj.type === 1) this.direction = -1;
      else this.direction = 1;
      this.speed = obj.speed;
      this.startx = obj.startx;
    } else if (this.type === "teleportOut") {
      this.radius = obj.radius;
      this.color = obj.color;
      this.travel = obj.travel;
      this.speed = obj.speed;
      this.startx = obj.startx;
    } else if (this.type === "powerupStart") {
      this.color = "#00FF22";
      this.width = 1300;
      this.height = this.width * SHIP_RATIO;
    } else if (this.type === "powerup") {
      this.sound = document.getElementById("power");
      if (this.sound) {
        this.sound.play();
      }
      this.color = "#00B418"; //"#00FF22";
      this.width = SHIP_WIDTH;
      this.height = this.width * SHIP_RATIO;
      this.speed = ship.speed;
      this.buffer = 6;
    }
  }

  update() {
    this.timer++;
    if (this.type === "death") {
      this.radius =
        -60 * this.sketch.cos(this.sketch.map(this.timer, 0, 45, 0, 2 * PI)) +
        60;
      this.thickness =
        -20 * this.sketch.cos(this.sketch.map(this.timer, 0, 45, 0, PI)) + 20;
    } else if (this.type === "damage") {
      this.position.y += this.speed;
      this.position.x =
        this.direction * this.sketch.sin(0.01 * this.position.y) * this.travel +
        this.startx;
    } else if (this.type === "playerDeath") {
      this.radius =
        -750 *
          this.sketch.cos(
            0.75 * this.sketch.map(this.timer, 0, 45, 0, 2 * PI)
          ) +
        750;
      this.thickness =
        -50 *
          this.sketch.cos(0.75 * this.sketch.map(this.timer, 0, 45, 0, PI)) +
        50;
    } else if (this.type === "teleportOut") {
      this.position.y += this.speed;
      this.position.x =
        this.sketch.sin(0.01 * this.position.y) * this.travel + this.startx;
      this.radius -= 2 / 3;
    } else if (this.type === "powerupStart") {
      this.width -= 43;
      this.height = this.width * SHIP_RATIO;
    }
  }

  show() {
    this.sketch.push();

    if (this.type === "death" || this.type === "playerDeath") {
      this.sketch.fill("#24344c");
      // this.sketch.noFill();
      this.sketch.stroke(this.color);
      this.sketch.strokeWeight(this.thickness);
      this.sketch.ellipse(this.position.x, this.position.y, this.radius);
    } else if (this.type === "damage") {
      this.sketch.fill(this.color);
      this.sketch.noStroke();
      this.sketch.ellipse(this.position.x, this.position.y, this.radius);
    } else if (this.type === "teleportOut") {
      this.sketch.fill(this.color);
      this.sketch.noStroke();
      this.sketch.ellipse(this.position.x, this.position.y, this.radius);
    } else if (this.type === "powerupStart") {
      this.sketch.noFill();
      this.sketch.strokeWeight(20);
      this.sketch.stroke(this.color);
      this.sketch.triangle(
        this.ship.position.x,
        this.ship.position.y + SHIP_LENGTH / 2 - this.height / 2,
        this.ship.position.x - this.width,
        this.ship.position.y + SHIP_LENGTH / 2 + this.height / 2,
        this.ship.position.x + this.width,
        this.ship.position.y + SHIP_LENGTH / 2 + this.height / 2
      );
    } else if (this.type === "powerup") {
      this.sketch.fill(this.color);
      this.sketch.noStroke();
      this.sketch.triangle(
        this.ship.position.x,
        this.ship.position.y +
          SHIP_LENGTH / 2 -
          this.height / 2 -
          this.buffer * 2,
        this.ship.position.x - this.width - this.buffer,
        this.ship.position.y + SHIP_LENGTH / 2 + this.height / 2 + this.buffer,
        this.ship.position.x + this.width + this.buffer,
        this.ship.position.y + SHIP_LENGTH / 2 + this.height / 2 + this.buffer
      );
    }

    this.sketch.pop();
  }
}
