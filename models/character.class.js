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

  // Animation manager handles all animation-related functionality
  animationManager;
  world;

  /**
   * Creates a new Character instance and initializes all properties
   * Sets up animations, sounds, gravity and starts the animation loop
   */
  constructor() {
    super();
    this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.animationManager = new CharacterAnimationManager(this);
    this.animationManager.loadAllAnimationImages();
    this.initSounds();
    this.lastActionTime = new Date().getTime();
    this.collectedBottles = 5;
    this.applyGravity();
    this.animate();
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
   * Starts all animation loops for the character
   * Initializes both movement and visual animation intervals
   */
  animate() {
    this.startMovementAnimation();
    this.animationManager.startVisualAnimation();
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
    this.animationManager.justLanded = true;
    this.stopSleepingSound();
    this.animationManager.setLandingAnimation();
    this.animationManager.scheduleLandingUpdates();
  }

  /**
   * Checks if character is currently moving
   * @returns {boolean} True if left or right key is pressed
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Calculates time elapsed since last character action
   * @returns {number} Time in milliseconds since last action
   */
  getTimeSinceLastAction() {
    return new Date().getTime() - this.lastActionTime;
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
      this.animationManager.processIdleCheck();
    }, 250);
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
    if (!this.isRunning) {
      this.isRunning = true;
      this.runSound.loop = true;
      this.runSound.volume = window.isMuted ? 0 : 0.4;
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
    if (!this.isSleeping) {
      this.isSleeping = true;
      this.sleepingSound.loop = true;
      this.sleepingSound.volume = window.isMuted ? 0 : 0.3;
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