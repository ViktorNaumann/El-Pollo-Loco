/**
 * ThrowableObject class
 * Represents throwable bottle objects that can be thrown by the player
 * Includes rotation animation and splash effects on impact
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    IMAGES_ROTATE = [
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];
    IMAGES_SPLASH = [
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];
    hasHit = false;
    /**
     * Creates a new throwable bottle object
     * @param {number} x - Starting x position
     * @param {number} y - Starting y position
     * @param {boolean} otherDirection - Direction flag (true = left, false = right)
     */
    constructor(x, y, otherDirection) {
      super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
      this.x = x;
      this.y = y;
      this.height = 60;
      this.width = 50;
      this.throw(otherDirection);
      this.loadImages(this.IMAGES_ROTATE);
      this.loadImages(this.IMAGES_SPLASH);
      this.breakSound = new Audio("audio/break.mp3");
      this.animateRotation();
    }
    /**
     * Applies custom gravity to the throwable object
     * Creates a parabolic trajectory and handles landing
     */
    applyGravity() {
      let gravityInterval = setInterval(() => {
        if(this.exploded) {
          clearInterval(gravityInterval);
          return;
        }
        if(this.y < 350) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        } else {
          this.y = 350;
          this.explode();
          clearInterval(gravityInterval);
        }
      }, 1000 / 25);
    }
    /**
     * Starts the bottle rotation animation while in flight
     */
    animateRotation() {
      let interval = setInterval(() => {
        if(this.exploded || this.isSplashing) {
          clearInterval(interval);
        } else {
          this.playAnimation(this.IMAGES_ROTATE);
        }
      }, 50);
    }
    /**
     * Handles bottle impact with ground or enemies
     * Plays splash animation and sound
     */
    explode() {
      if(this.exploding) return;
      this.exploding = true;
      this.speedY = 0;
      this.speed = 0;
      this.isSplashing = true;
      if(this.throwInterval) clearInterval(this.throwInterval);
      this.animateSplash();
      window.playSound(this.breakSound, 0.5);
      let splashDuration = this.IMAGES_SPLASH.length * 150;
      setTimeout(() => {
        this.exploded = true;
      }, splashDuration);
    }
    /**
     * Plays the bottle splash animation sequence
     */
    animateSplash() {
      let i = 0;
      let splashInterval = setInterval(() => {
        if(i < this.IMAGES_SPLASH.length) {
          let path = this.IMAGES_SPLASH[i];
          let img = this.imageCache[path];
          if(img) this.img = img;
          i++;
        } else {
          clearInterval(splashInterval);
        }
      }, 150);
    }
    /**
     * Initiates the throwing motion of the bottle
     * @param {boolean} otherDirection - Direction flag (true = left, false = right)
     */
    throw(otherDirection) {
      this.speedY = 20;
      this.applyGravity();
      this.throwInterval = setInterval(() => {
          if(otherDirection) {
              this.x -= 7;
          } else {
              this.x += 7;
          }
      }, 25);
    }
}
