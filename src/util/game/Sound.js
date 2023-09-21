export class Sound {
  constructor(src, autoplay = false, loop = false) {
    this.sound = new Audio(src);
    this.sound.preload = "none";
    this.sound.controls = false;
    this.sound.autoplay = autoplay;
    this.sound.loop = loop;
    this.sound.style.display = "none";
  }

  play() {
    this.sound.play().catch(() => {
      console.log("Waiting for user....");
    });
  }

  stop() {
    this.sound.pause();
  }

  isPaused() {
    return this.sound.paused;
  }

  isPlaying() {
    return !this.isPaused();
  }
}
