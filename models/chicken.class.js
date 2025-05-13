/**
 * Chicken class
 * Represents enemy chickens that move around the level
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  y = 390;
  offset = { top: 5, left: 5, right: 5, bottom: 5 };

  IMAGES_SMALL_DEAD = [
    'img/3_enemies_chicken/chicken_small/2_dead/dead.png',  
  ];
  IMAGES_BIG_DEAD = [
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
  ];
  IMAGES_SMALL = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];
  IMAGES_BIG = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];
  IMAGES_DEAD = [
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
  ];

  /**
   * Creates a chicken enemy
   * @param {boolean} isBig - Whether this is a big chicken
   * @param {number} x - Initial x position
   */
  constructor(isBig = false, x = 200 + Math.random() * 3300) {
    super();
    this.x = x;
    this.speed = 0.15 + Math.random() * 0.25;
    this.otherDirection = Math.random() < 0.5;
    this.changeDirectionTime = Date.now();
    this.minDirectionTime = 3000 + Math.random() * 2000;
    this.maxDirectionTime = 5000 + Math.random() * 3000;
    this.pauseProbability = 0.005;
    this.pauseDuration = 1000 + Math.random() * 2000;
    this.isPaused = false;
    this.lastPauseTime = 0;

    if (isBig) {
      this.height = 80;
      this.width = 80;
      this.y = 390 - (this.height - 40);
      this.loadImage(this.IMAGES_BIG[0]);
      this.loadImages(this.IMAGES_BIG);
      this.animationSet = this.IMAGES_BIG;
    } else {
      this.height = 40;
      this.width = 40;
      this.y = 390;
      this.loadImage(this.IMAGES_SMALL[0]);
      this.loadImages(this.IMAGES_SMALL);
      this.animationSet = this.IMAGES_SMALL;
    }

    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  /**
   * Sets up animation and movement intervals
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (this.otherDirection) {
        this.moveRight();
      } else {
        this.moveLeft();
      }
      let currentTime = Date.now();
      if (currentTime - this.changeDirectionTime > this.getRandomDirectionTime()) {
        this.otherDirection = Math.random() < 0.6 ? !this.otherDirection : this.otherDirection;
        this.changeDirectionTime = currentTime;
        this.speed = 0.15 + Math.random() * 0.25;
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      this.playAnimation(this.animationSet);
    }, 150);
  }

  /**
   * Gets a random time interval for direction changes
   * @returns {number} Time in milliseconds
   */
  getRandomDirectionTime() {
    return Math.random() * (this.maxDirectionTime - this.minDirectionTime) + this.minDirectionTime;
  }

  /**
   * Moves the chicken right and handles boundary collision
   */
  moveRight() {
    super.moveRight();
    if (this.x > 3500) {
      this.otherDirection = false;
      this.changeDirectionTime = Date.now();
    }
  }

  /**
   * Moves the chicken left and handles boundary collision
   */
  moveLeft() {
    super.moveLeft();
    if (this.x < 0) {
      this.otherDirection = true;
      this.changeDirectionTime = Date.now();
    }
  }

  /**
   * Handles chicken death - stops movement and changes image
   */
  die() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    this.speed = 0;

    if (this.height > 40) {
      this.loadImage(this.IMAGES_BIG_DEAD[0]);
    } else {
      this.loadImage(this.IMAGES_SMALL_DEAD[0]);
    }
    this.loadImage(this.IMAGES_DEAD[0]);
    this.isDead = true;
  }
}

