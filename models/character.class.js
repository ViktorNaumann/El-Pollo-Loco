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
  isSleeping = false;
  gravityInterval = null;
  wasAboveGroundLastFrame = false;
  justLanded = false;
  lastLandingTime = 0;

  IMAGES_IDLE = ['img/2_character_pepe/1_idle/idle/I-1.png', 'img/2_character_pepe/1_idle/idle/I-2.png', 'img/2_character_pepe/1_idle/idle/I-3.png', 'img/2_character_pepe/1_idle/idle/I-4.png', 'img/2_character_pepe/1_idle/idle/I-5.png', 'img/2_character_pepe/1_idle/idle/I-6.png', 'img/2_character_pepe/1_idle/idle/I-7.png', 'img/2_character_pepe/1_idle/idle/I-8.png', 'img/2_character_pepe/1_idle/idle/I-9.png', 'img/2_character_pepe/1_idle/idle/I-10.png'];
  IMAGES_LONG_IDLE = ['img/2_character_pepe/1_idle/long_idle/I-11.png', 'img/2_character_pepe/1_idle/long_idle/I-12.png', 'img/2_character_pepe/1_idle/long_idle/I-13.png', 'img/2_character_pepe/1_idle/long_idle/I-14.png', 'img/2_character_pepe/1_idle/long_idle/I-15.png', 'img/2_character_pepe/1_idle/long_idle/I-16.png', 'img/2_character_pepe/1_idle/long_idle/I-17.png', 'img/2_character_pepe/1_idle/long_idle/I-18.png', 'img/2_character_pepe/1_idle/long_idle/I-19.png', 'img/2_character_pepe/1_idle/long_idle/I-20.png'];
  IMAGES_WALKING = ['img/2_character_pepe/2_walk/W-21.png', 'img/2_character_pepe/2_walk/W-22.png', 'img/2_character_pepe/2_walk/W-23.png', 'img/2_character_pepe/2_walk/W-24.png', 'img/2_character_pepe/2_walk/W-25.png', 'img/2_character_pepe/2_walk/W-26.png'];
  IMAGES_JUMPING = ['img/2_character_pepe/3_jump/J-31.png', 'img/2_character_pepe/3_jump/J-32.png', 'img/2_character_pepe/3_jump/J-33.png', 'img/2_character_pepe/3_jump/J-34.png', 'img/2_character_pepe/3_jump/J-35.png', 'img/2_character_pepe/3_jump/J-36.png', 'img/2_character_pepe/3_jump/J-37.png', 'img/2_character_pepe/3_jump/J-38.png', 'img/2_character_pepe/3_jump/J-39.png'];
  IMAGES_DEAD = ['img/2_character_pepe/5_dead/D-51.png', 'img/2_character_pepe/5_dead/D-52.png', 'img/2_character_pepe/5_dead/D-53.png', 'img/2_character_pepe/5_dead/D-54.png', 'img/2_character_pepe/5_dead/D-55.png', 'img/2_character_pepe/5_dead/D-56.png', 'img/2_character_pepe/5_dead/D-57.png'];
  IMAGES_HURT = ['img/2_character_pepe/4_hurt/H-41.png', 'img/2_character_pepe/4_hurt/H-42.png', 'img/2_character_pepe/4_hurt/H-43.png'];
  world;

  /**
   * Creates a new Character instance and initializes all properties
   * Sets up animations, sounds, gravity and starts the animation loop
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
   * Loads all animation images for different character states
   * Preloads walking, jumping, death, hurt, idle and long idle animations
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
   * Initializes all sound effects for the character
   * Sets up jump, run and sleeping sounds with appropriate volumes
   */
  initSounds() {
    this.jumpSound = new Audio("audio/jump.mp3");
    this.runSound = new Audio("audio/run.mp3");
    this.sleepingSound = new Audio("audio/sleeping.mp3");
    this.jumpSound.volume = 0.4;
    this.runSound.volume = 0.4;
    this.sleepingSound.volume = 0.3;
    this.sleepingSound.loop = true;
  }

  /**
   * Plays animation with a custom speed/delay
   * @param {string[]} images - Array of image paths for the animation
   * @param {number} delay - Delay between animation frames in milliseconds
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
   * Starts all animation loops for the character
   * Initializes both movement and visual animation intervals
   */
  animate() {
    this.startMovementAnimation();
    this.startVisualAnimation();
  }

  /**
   * Starts the movement animation loop at 60 FPS
   * Handles landing detection, movement input, jumping and camera updates
   */
  startMovementAnimation() {
    setInterval(() => {
      this.checkForLanding();
      this.handleMovementInput();
      this.handleJumpInput();
      this.updateCamera();
    }, 1000 / 60);
  }

  /**
   * Starts the visual animation loop at 10 FPS
   * Updates character sprite animations based on current state
   */
  startVisualAnimation() {
    setInterval(() => {
      this.updateCharacterAnimation();
    }, 1000 / 10);
  }

  /**
   * Handles keyboard input for left and right movement
   * Checks boundaries and triggers appropriate movement methods
   */
  handleMovementInput() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.handleRightMovement();
    } else if (this.world.keyboard.LEFT && this.x > 0) {
      this.handleLeftMovement();
    } else {
      this.stopRunningSound();
    }
  }

  /**
   * Handles movement to the right
   * Sets direction, plays running sound and updates action time
   */
  handleRightMovement() {
    this.moveRight();
    this.otherDirection = false;
    if (!this.isAboveGround() && !this.isRunning) {
      this.startRunningSound();
    }
    this.lastActionTime = new Date().getTime();
  }

  /**
   * Handles movement to the left
   * Sets direction, plays running sound and updates action time
   */
  handleLeftMovement() {
    this.moveLeft();
    this.otherDirection = true;
    if (!this.isAboveGround() && !this.isRunning) {
      this.startRunningSound();
    }
    this.lastActionTime = new Date().getTime();
  }

  /**
   * Handles jumping input and stops running sound when airborne
   * Only allows jumping when character is on the ground
   */
  handleJumpInput() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      window.playSound(this.jumpSound, 0.4);
      this.lastActionTime = new Date().getTime();
    }
    if (this.isAboveGround()) {
      this.stopRunningSound();
    }
  }

  /**
   * Updates the camera position to follow the character
   * Centers the character in the viewport with an offset
   */
  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Checks if the character has just landed on the ground
   * Detects transition from airborne to ground state
   */
  checkForLanding() {
    const isCurrentlyAboveGround = this.isAboveGround();
    if (this.hasJustLanded(isCurrentlyAboveGround)) {
      this.processLanding();
    }
    this.wasAboveGroundLastFrame = isCurrentlyAboveGround;
  }

  /**
   * Determines if character has just landed
   * @param {boolean} isCurrentlyAboveGround - Current airborne state
   * @returns {boolean} True if character just landed
   */
  hasJustLanded(isCurrentlyAboveGround) {
    return this.wasAboveGroundLastFrame && !isCurrentlyAboveGround && this.speedY <= 0;
  }

  /**
   * Processes character landing sequence
   * Handles landing effects, animations and sound management
   */
  processLanding() {
    this.handleLanding();
    this.justLanded = true;
    this.stopSleepingSound();
    this.setLandingAnimation();
    this.scheduleLandingUpdates();
  }

  /**
   * Sets appropriate animation when character lands
   * Chooses between walking or idle animation based on input
   */
  setLandingAnimation() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.forceAnimation(this.IMAGES_WALKING);
    } else {
      this.forceAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Schedules animation updates after landing
   * Sets timers for immediate animation update and landing state reset
   */
  scheduleLandingUpdates() {
    setTimeout(() => this.updateCharacterAnimation(), 16);
    setTimeout(() => this.justLanded = false, 150);
  }

  /**
   * Updates character animation based on current state
   * Determines and sets appropriate animation based on time since last action
   */
  updateCharacterAnimation() {
    const timeSinceLastAction = this.getTimeSinceLastAction();
    const animationImages = this.determineAnimationImages(timeSinceLastAction);
    this.setAnimation(animationImages);
  }

  /**
   * Calculates time elapsed since last character action
   * @returns {number} Time in milliseconds since last action
   */
  getTimeSinceLastAction() {
    return new Date().getTime() - this.lastActionTime;
  }

  /**
   * Determines appropriate animation images based on character state
   * @param {number} timeSinceLastAction - Time elapsed since last action
   * @returns {string[]} Array of animation image paths
   */
  determineAnimationImages(timeSinceLastAction) {
    if (this.isDead()) {
      this.stopSleepingSound();
      return this.IMAGES_DEAD;
    }
    if (this.isHurt()) {
      this.stopSleepingSound();
      return this.IMAGES_HURT;
    }
    if (this.isAboveGround()) {
      this.stopSleepingSound();
      return this.IMAGES_JUMPING;
    }
    if (this.isMoving()) {
      this.stopSleepingSound();
      return this.IMAGES_WALKING;
    }
    if (timeSinceLastAction > 5000) {
      this.startSleepingSound();
      return this.IMAGES_LONG_IDLE;
    }
    this.stopSleepingSound();
    return this.IMAGES_IDLE;
  }

  /**
   * Checks if character is currently moving
   * @returns {boolean} True if left or right key is pressed
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Updates character position and applies physics
   * Stores previous Y position, moves character and applies gravity
   */
  update() {
    this.previousY = this.y;
    this.move();
    this.applyGravity();
  }

  /**
   * Handles character landing effects and sound
   * Prevents rapid repeated landing sounds with cooldown
   */
  handleLanding() {
    const currentTime = new Date().getTime();
    if (currentTime - this.lastLandingTime < 200) {
      return;
    }
    this.lastLandingTime = currentTime;
    if (this.world && this.world.audioManager) {
      this.world.audioManager.playLandingSound();
    }
  }

  /**
   * Sets up idle check interval for long idle detection
   * Runs idle check every 250ms to manage sleeping animation
   */
  idleCheckInterval() {
    setInterval(() => {
      this.processIdleCheck();
    }, 250);
  }

  /**
   * Processes idle state check for long idle animation
   * Starts or stops long idle animation based on inactivity
   */
  processIdleCheck() {
    const timeSinceLastAction = this.getTimeSinceLastAction();
    if (this.shouldStartLongIdle(timeSinceLastAction)) {
      this.startLongIdleAnimation();
    } else {
      this.stopLongIdleAnimation();
    }
  }

  /**
   * Determines if long idle animation should start
   * @param {number} timeSinceLastAction - Time elapsed since last action
   * @returns {boolean} True if character should start long idle
   */
  shouldStartLongIdle(timeSinceLastAction) {
    return timeSinceLastAction > 5000 && !this.isDead() && !this.isHurt();
  }

  /**
   * Starts the long idle animation if not already running
   * Sets up interval for long idle animation sequence
   */
  startLongIdleAnimation() {
    if (!this.longIdleInterval) {
      this.longIdleInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_LONG_IDLE);
      }, 400);
    }
  }

  /**
   * Stops the long idle animation
   * Clears the long idle interval and resets the reference
   */
  stopLongIdleAnimation() {
    clearInterval(this.longIdleInterval);
    this.longIdleInterval = null;
  }

  /**
   * Sets the current animation based on character state
   */
  setAnimation(images) {
    if (this.shouldPlayDeathAnimation(images)) {
      this.handleDeathAnimation(images);
      return;
    }
    this.updateCurrentAnimation(images);
  }

  /**
   * Checks if death animation should be played
   */
  shouldPlayDeathAnimation(images) {
    return images === this.IMAGES_DEAD;
  }

  /**
   * Handles death animation sequence
   */
  handleDeathAnimation(images) {
    if (!this.isDeadAnimationPlayed) {
      this.isDeadAnimationPlayed = true;
      this.playAnimationOnce(images);
      setTimeout(() => {
        if (this.world) {
          this.world.triggerGameOver();
        }
      }, images.length * 150);
    }
  }

  /**
   * Updates current animation if different from previous
   */
  updateCurrentAnimation(images) {
    if (this.currentAnimation !== images) {
      this.currentImage = 0;
      this.currentAnimation = images;
      let delay = this.getAnimationDelay(images);
      this.playAnimationWithSpeed(images, delay);
    }
  }

  /**
   * Forces animation change even if same animation type
   */
  forceAnimation(images) {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    this.currentImage = 0;
    this.currentAnimation = images;
    if (images.length > 0 && this.imageCache[images[0]]) {
      this.img = this.imageCache[images[0]];
    }
    let delay = this.getAnimationDelay(images);
    this.playAnimationWithSpeed(images, delay);
  }

  /**
   * Gets animation delay based on image type
   */
  getAnimationDelay(images) {
    if (images === this.IMAGES_IDLE) return 300;
    if (images === this.IMAGES_LONG_IDLE) return 300;
    if (images === this.IMAGES_WALKING) return 80;
    if (images === this.IMAGES_JUMPING) return 120;
    if (images === this.IMAGES_HURT) return 80;
    return 100;
  }

  /**
   * Checks if character is dead and triggers game over
   */
  isDead() {
    if (this.energy <= 0) {
      this.handleCharacterDeath();
      return true;
    }
    return false;
  }

  /**
   * Handles character death sequence
   */
  handleCharacterDeath() {
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

  /**
   * Starts the sleeping sound if not already playing
   */
  startSleepingSound() {
    if (!this.isSleeping && !window.isMuted) {
      this.isSleeping = true;
      this.sleepingSound.loop = true;
      this.sleepingSound.volume = 0.3;
      this.sleepingSound.play().catch(err => console.log('Sleep sound error:', err));
    }
  }
  
  /**
   * Stops the sleeping sound
   */
  stopSleepingSound() {
    if (this.isSleeping) {
      this.isSleeping = false;
      this.sleepingSound.pause();
      this.sleepingSound.currentTime = 0;
    }
  }
}