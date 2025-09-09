/**
 * CharacterAnimationManager class
 * Manages all animation-related functionality for the Character class
 * Handles animation states, transitions, and timing
 */
class CharacterAnimationManager {
  constructor(character) {
    this.character = character;
    this.animationInterval = null;
    this.longIdleInterval = null;
    this.currentAnimation = null;
    this.isDeadAnimationPlayed = false;
    this.justLanded = false;
    
    // Animation image arrays
    this.IMAGES_IDLE = ['img/2_character_pepe/1_idle/idle/I-1.png', 'img/2_character_pepe/1_idle/idle/I-2.png', 'img/2_character_pepe/1_idle/idle/I-3.png', 'img/2_character_pepe/1_idle/idle/I-4.png', 'img/2_character_pepe/1_idle/idle/I-5.png', 'img/2_character_pepe/1_idle/idle/I-6.png', 'img/2_character_pepe/1_idle/idle/I-7.png', 'img/2_character_pepe/1_idle/idle/I-8.png', 'img/2_character_pepe/1_idle/idle/I-9.png', 'img/2_character_pepe/1_idle/idle/I-10.png'];
    this.IMAGES_LONG_IDLE = ['img/2_character_pepe/1_idle/long_idle/I-11.png', 'img/2_character_pepe/1_idle/long_idle/I-12.png', 'img/2_character_pepe/1_idle/long_idle/I-13.png', 'img/2_character_pepe/1_idle/long_idle/I-14.png', 'img/2_character_pepe/1_idle/long_idle/I-15.png', 'img/2_character_pepe/1_idle/long_idle/I-16.png', 'img/2_character_pepe/1_idle/long_idle/I-17.png', 'img/2_character_pepe/1_idle/long_idle/I-18.png', 'img/2_character_pepe/1_idle/long_idle/I-19.png', 'img/2_character_pepe/1_idle/long_idle/I-20.png'];
    this.IMAGES_WALKING = ['img/2_character_pepe/2_walk/W-21.png', 'img/2_character_pepe/2_walk/W-22.png', 'img/2_character_pepe/2_walk/W-23.png', 'img/2_character_pepe/2_walk/W-24.png', 'img/2_character_pepe/2_walk/W-25.png', 'img/2_character_pepe/2_walk/W-26.png'];
    this.IMAGES_JUMPING = ['img/2_character_pepe/3_jump/J-31.png', 'img/2_character_pepe/3_jump/J-32.png', 'img/2_character_pepe/3_jump/J-33.png', 'img/2_character_pepe/3_jump/J-34.png', 'img/2_character_pepe/3_jump/J-35.png', 'img/2_character_pepe/3_jump/J-36.png', 'img/2_character_pepe/3_jump/J-37.png', 'img/2_character_pepe/3_jump/J-38.png', 'img/2_character_pepe/3_jump/J-39.png'];
    this.IMAGES_DEAD = ['img/2_character_pepe/5_dead/D-51.png', 'img/2_character_pepe/5_dead/D-52.png', 'img/2_character_pepe/5_dead/D-53.png', 'img/2_character_pepe/5_dead/D-54.png', 'img/2_character_pepe/5_dead/D-55.png', 'img/2_character_pepe/5_dead/D-56.png', 'img/2_character_pepe/5_dead/D-57.png'];
    this.IMAGES_HURT = ['img/2_character_pepe/4_hurt/H-41.png', 'img/2_character_pepe/4_hurt/H-42.png', 'img/2_character_pepe/4_hurt/H-43.png'];
  }

  /**
   * Loads all animation images for different character states
   * Preloads walking, jumping, death, hurt, idle and long idle animations
   */
  loadAllAnimationImages() {
    this.character.loadImages(this.IMAGES_WALKING);
    this.character.loadImages(this.IMAGES_JUMPING);
    this.character.loadImages(this.IMAGES_DEAD);
    this.character.loadImages(this.IMAGES_HURT);
    this.character.loadImages(this.IMAGES_IDLE);
    this.character.loadImages(this.IMAGES_LONG_IDLE);
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
      this.character.playAnimation(images);
    }, delay);
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
   * Updates character animation based on current state
   * Determines and sets appropriate animation based on time since last action
   */
  updateCharacterAnimation() {
    const timeSinceLastAction = this.character.getTimeSinceLastAction();
    const animationImages = this.determineAnimationImages(timeSinceLastAction);
    this.setAnimation(animationImages);
  }

  /**
   * Determines appropriate animation images based on character state
   * @param {number} timeSinceLastAction - Time elapsed since last action
   * @returns {string[]} Array of animation image paths
   */
  determineAnimationImages(timeSinceLastAction) {
    if (this.character.isDead()) {
      this.character.stopSleepingSound();
      return this.IMAGES_DEAD;
    }
    if (this.character.isHurt()) {
      this.character.stopSleepingSound();
      return this.IMAGES_HURT;
    }
    if (this.character.isAboveGround()) {
      this.character.stopSleepingSound();
      return this.IMAGES_JUMPING;
    }
    if (this.character.isMoving()) {
      this.character.stopSleepingSound();
      return this.IMAGES_WALKING;
    }
    if (timeSinceLastAction > 5000) {
      this.character.startSleepingSound();
      return this.IMAGES_LONG_IDLE;
    }
    this.character.stopSleepingSound();
    return this.IMAGES_IDLE;
  }

  /**
   * Sets appropriate animation when character lands
   * Chooses between walking or idle animation based on input
   */
  setLandingAnimation() {
    if (this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT) {
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
   * Processes idle state check for long idle animation
   * Starts or stops long idle animation based on inactivity
   */
  processIdleCheck() {
    const timeSinceLastAction = this.character.getTimeSinceLastAction();
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
    return timeSinceLastAction > 5000 && !this.character.isDead() && !this.character.isHurt();
  }

  /**
   * Starts the long idle animation if not already running
   * Sets up interval for long idle animation sequence
   */
  startLongIdleAnimation() {
    if (!this.longIdleInterval) {
      this.longIdleInterval = setInterval(() => {
        this.character.playAnimation(this.IMAGES_LONG_IDLE);
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
      this.character.playAnimationOnce(images);
      setTimeout(() => {
        if (this.character.world) {
          this.character.world.triggerGameOver();
        }
      }, images.length * 150);
    }
  }

  /**
   * Updates current animation if different from previous
   */
  updateCurrentAnimation(images) {
    if (this.currentAnimation !== images) {
      this.character.currentImage = 0;
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
    this.character.currentImage = 0;
    this.currentAnimation = images;
    if (images.length > 0 && this.character.imageCache[images[0]]) {
      this.character.img = this.character.imageCache[images[0]];
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
   * Sets up idle check interval for long idle detection
   * Runs idle check every 250ms to manage sleeping animation
   */
  idleCheckInterval() {
    setInterval(() => {
      this.processIdleCheck();
    }, 250);
  }
}
