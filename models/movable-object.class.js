/**
 * MovableObject class
 * Base class for all game objects that can move around in the game world
 * Implements core physics like gravity, collision detection, and animations
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.1;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity physics to the object
   * Called continuously to simulate falling motion
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.y >= 195 && this.speedY <= 0) {
          this.y = 185;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is currently above the ground
   * @returns {boolean} True if object is above ground level
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 185;
    }
  }

  /**
   * Checks if this object is colliding with another object
   * Uses offset values to create more accurate collision boxes
   * @param {MovableObject} other - The other object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(other) {
    const thisLeft   = this.x + this.offset.left;
    const thisRight  = this.x + this.width - this.offset.right;
    const thisTop    = this.y + this.offset.top;
    const thisBottom = this.y + this.height - this.offset.bottom;
    const otherLeft   = other.x + other.offset.left;
    const otherRight  = other.x + other.width - other.offset.right;
    const otherTop    = other.y + other.offset.top;
    const otherBottom = other.y + other.height - other.offset.bottom;
    return (
      thisRight > otherLeft &&
      thisLeft < otherRight &&
      thisBottom > otherTop &&
      thisTop < otherBottom
    );
  }
  
  /**
   * Reduces object's energy when hit
   * Also records the hit time for status effects
   * @param {number} [damage=20] - Amount of damage to apply
   */
  hit(damage = 20) {
    this.lastHit = new Date().getTime();
    this.energy -= damage; 
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  /**
   * Checks if the object is currently in hurt state
   * @returns {boolean} True if the object was hit recently
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 1000;
  }

  /**
   * Checks if the object is dead (no energy left)
   * @returns {boolean} True if energy is zero
   */
  isDead() {
    return this.energy == 0; // Check if the energy is 0
  }

  /**
   * Plays a looping animation sequence from the provided images
   * @param {Array<string>} images - Array of image paths to animate
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    } else {
      this.img.src = path;
    }
    this.currentImage++;
  }

  /**
   * Plays an animation sequence once through and stops on last frame
   * @param {Array<string>} images - Array of image paths to animate
   */
  playAnimationOnce(images) {
    let i = 0;
    let interval = setInterval(() => {
      if (i < images.length) {
        let path = images[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        clearInterval(interval);
        let lastImage = images[images.length - 1];
        this.img = this.imageCache[lastImage];
      }
    }, 150);
  }
  
  /**
   * Moves the object to the right
   */
  moveRight() {
    this.x += this.speed; // Move right by speed
  }

  /**
   * Moves the object to the left
   */
  moveLeft() {
    this.x -= this.speed; // Move left by speed
  }

  /**
   * Makes the object jump upward
   */
  jump() {
    this.speedY = 22; // Set the speedY to a positive value to move up
  }
}
