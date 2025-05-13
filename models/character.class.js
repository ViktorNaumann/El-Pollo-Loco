/**
 * Character class
 * Represents the main playable character (Pepe) in the game.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 250;
  width = 130;
  x = 100;
  y = 85;
  speed = 6;
  offset = {
    top: 120,  
    left: 40,
    right: 40,
    bottom: 10,
  };
  isDeadAnimationPlayed = false;
  isRunning = false;

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png'
  ];
  IMAGES_LONG_IDLE = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png'
  ];
  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];
  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];
  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];
  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];
  world;

  /**
   * Creates a new Character instance
   */
  constructor() {
    super();
    this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadAllAnimationImages();
    this.initSounds();
    this.lastActionTime = new Date().getTime();
    this.collectedBottles = 5;
    this.applyGravity();
    this.animate();
  }
  
  /**
   * Loads all animation image sets
   */
  loadAllAnimationImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
  }
  
  /**
   * Initializes all sounds used by the character
   */
  initSounds() {
    this.jumpSound = new Audio("audio/jump.mp3");
    this.runSound = new Audio("audio/run.mp3");
    this.jumpSound.volume = 0.4;
    this.runSound.volume = 0.4;
  }

  /**
   * Plays animation with specified delay time
   * @param {Array<string>} images - Array of image paths to animate
   * @param {number} delay - Delay in ms between frames
   */
  playAnimationWithSpeed(images, delay) {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    this.animationInterval = setInterval(() => {
      this.playAnimation(images);
    }, delay);
  }

  /**
   * Sets up character animation and movement intervals
   */
  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        if (!this.isAboveGround() && !this.isRunning) {
          this.startRunningSound();
        }
        this.lastActionTime = new Date().getTime();
      }
      else if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        if (!this.isAboveGround() && !this.isRunning) {
          this.startRunningSound();
        }
        this.lastActionTime = new Date().getTime();
      }
      else {
        this.stopRunningSound();
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        window.playSound(this.jumpSound, 0.4);
        this.lastActionTime = new Date().getTime();
      }
      if (this.isAboveGround()) {
        this.stopRunningSound();
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
  
    setInterval(() => {
      let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
      if (this.isDead()) {
        this.setAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.setAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.setAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.setAnimation(this.IMAGES_WALKING);
      } else if (timeSinceLastAction > 5000) {
        this.setAnimation(this.IMAGES_LONG_IDLE);
      } else {
        this.setAnimation(this.IMAGES_IDLE);
      }
    }, 1000 / 10);
  }

  /**
   * Updates character position and applies gravity
   */
  update() {
    this.previousY = this.y;
    this.move();
    this.applyGravity();
  }

  /**
   * Sets up interval to check for idle state
   */
  idleCheckInterval() {
    setInterval(() => {
      let now = new Date().getTime();
      let timeSinceLastAction = now - this.lastActionTime;
      if (timeSinceLastAction > 5000 && !this.isDead() && !this.isHurt()) {
        if (!this.longIdleInterval) {
          this.longIdleInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_LONG_IDLE);
          }, 400);
        }
      } else {
        clearInterval(this.longIdleInterval);
        this.longIdleInterval = null;
      }
    }, 250);
  }

  /**
   * Sets the current animation based on character state
   * @param {Array<string>} images - Array of image paths to animate
   */
  setAnimation(images) {
    if (images === this.IMAGES_DEAD) {
      if (!this.isDeadAnimationPlayed) {
        this.isDeadAnimationPlayed = true;
        this.playAnimationOnce(images);
        setTimeout(() => {
          if (this.world) {
            this.world.triggerGameOver();
          }
        }, images.length * 150);
      }
      return;
    }
    if (this.currentAnimation !== images) {
      this.currentImage = 0;
      this.currentAnimation = images;
      let delay = 100;
      if (images === this.IMAGES_IDLE) delay = 300;
      if (images === this.IMAGES_LONG_IDLE) delay = 300;
      if (images === this.IMAGES_WALKING) delay = 80;
      if (images === this.IMAGES_JUMPING) delay = 120;
      if (images === this.IMAGES_HURT) delay = 80;
      this.playAnimationWithSpeed(images, delay);
    }
  }

  /**
   * Checks if character is dead and triggers game over
   * @returns {boolean} True if character is dead
   */
  isDead() {
    if (this.energy <= 0) {
      if (!this.gameOverTriggered) {
        this.gameOverTriggered = true;
        if (this.playDeathAnimation) {
          this.playDeathAnimation();
        }
        setTimeout(() => {
          if (this.world) {
            this.world.triggerGameOver(false);
          }
        }, 1000);
      }
      return true;
    }
    return false;
  }

  /**
   * Starts the running sound if not already playing
   */
  startRunningSound() {
    if (!this.isRunning && !window.isMuted) {
      this.isRunning = true;
      this.runSound.loop = true;
      this.runSound.volume = 0.4;
      this.runSound.play().catch(err => console.log('Sound-Fehler:', err));
    }
  }
  
  /**
   * Stops the running sound
   */
  stopRunningSound() {
    if (this.isRunning) {
      this.isRunning = false;
      this.runSound.pause();
      this.runSound.currentTime = 0;
    }
  }
}
