/**
 * World class
 * Represents the game world containing all game objects and managing their interactions
 * Handles drawing, sound effects, and game state
 */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarBottle = new StatusBar("bottle");
  endbossStatusBar = new StatusBar("endboss");
  throwableObject = [];
  statusBarCoin = new StatusBar("coin");
  collectedCoins = 0;
  audioManager = new AudioManager();
  lastBottleThrowTime = 0;
  collisionHandler;
  animationFrame;

  /**
   * Creates a new game world instance
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering
   * @param {Keyboard} keyboard - Keyboard input handler
   * @param {Level} level - The game level containing all objects
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level || initLevel();
    this.endbossStatusBar.visible = false;
    this.statusBarCoin.setPercentage(0);
    this.collisionHandler = new CollisionHandler(this);
    this.setWorld();
    this.run();
    this.draw();
  }

  /**
   * Sets this world reference on character and endboss objects
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  /**
   * Starts the main game loop for collision checks and other game logic
   */
  run() {
    setInterval(() => {
      this.collisionHandler.checkCollisions();
      this.checkThrowObjects();
      this.collisionHandler.checkBottleHits();
      this.checkEndbossVisibility();
    }, 200);
  }

  /**
   * Checks if endboss is visible on screen and activates related game elements
   */
  checkEndbossVisibility() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!boss) return;
    const bossLeft = boss.x;
    const bossRight = boss.x + boss.width;
    const cameraLeft = -this.camera_x;
    const cameraRight = -this.camera_x + this.canvas.width;
    if (bossLeft >= cameraLeft && bossRight <= cameraRight) {
      this.endbossStatusBar.visible = true;
      boss.isVisible = true;
      boss.isActive = true;
      this.audioManager.startEndbossFightMusic();
    }
  }

  /**
   * Handles throwing objects when D key is pressed
   * Rate-limited to one bottle per second
   */
  checkThrowObjects() {
    const currentTime = new Date().getTime();
    const timeSinceLastThrow = currentTime - this.lastBottleThrowTime;
    const throwCooldown = 1000;
    if (this.canThrowBottle(timeSinceLastThrow, throwCooldown)) {
      this.throwBottle();
    }
  }

  /**
   * Checks if a bottle can be thrown based on conditions
   * @param {number} timeSinceLastThrow - Time since last bottle throw
   * @param {number} throwCooldown - Cooldown time for throwing
   * @returns {boolean} Whether a bottle can be thrown
   */
  canThrowBottle(timeSinceLastThrow, throwCooldown) {
    return this.keyboard.D && 
           this.character.collectedBottles > 0 && 
           timeSinceLastThrow >= throwCooldown;
  }

  /**
   * Creates and throws a new bottle object
   */
  throwBottle() {
    this.lastBottleThrowTime = new Date().getTime();
    this.character.collectedBottles--;
    this.statusBarBottle.setPercentage(this.character.collectedBottles * 20);
    const bottleX = this.character.otherDirection ? 
      this.character.x : 
      this.character.x + 100;
    const bottle = new ThrowableObject(
      bottleX,
      this.character.y + 100,
      this.character.otherDirection
    );
    bottle.world = this;
    this.audioManager.playThrowSound();
    this.throwableObject.push(bottle);
  }

  /**
   * Main drawing method that renders all game objects to the canvas
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawGameObjects();
    this.drawUI();
    this.requestNextFrame();
  }

  /**
   * Draws the background objects
   */
  drawBackground() {
    if (this.level && this.level.backgroundObjects) {
      this.ctx.translate(this.camera_x, 0);
      this.addObjectsToMap(this.level.backgroundObjects);
      this.ctx.translate(-this.camera_x, 0);
    }
  }

  /**
   * Draws all game objects (clouds, coins, bottles, enemies, character, etc.)
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.drawThrowableObjects();
    this.drawTumbleweeds();
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws throwable objects (bottles)
   */
  drawThrowableObjects() {
    this.throwableObject = this.throwableObject.filter((obj) => !obj.exploded);
    this.addObjectsToMap(this.throwableObject);
  }

  /**
   * Draws tumbleweed objects
   */
  drawTumbleweeds() {
    this.level.tumbleweeds.forEach(tumbleweed => {
      tumbleweed.draw(this.ctx);
    });
  }

  /**
   * Draws UI elements (status bars)
   */
  drawUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
    if (this.endbossStatusBar.visible) {
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Requests the next animation frame
   */
  requestNextFrame() {
    this.animationFrame = requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   * Adds an array of objects to the map
   * @param {Array<MovableObject>} objects - Array of objects to add to the map
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Adds a single object to the map with proper direction handling
   * @param {MovableObject} movableObject - Object to add to the map
   */
  addToMap(movableObject) {
    this.ctx.stroke();
    if (movableObject.otherDirection) {
      this.drawFlippedObject(movableObject);
    } else {
      this.drawNormalObject(movableObject);
    }
  }

  /**
   * Draws an object flipped horizontally
   * @param {MovableObject} movableObject - Object to draw flipped
   */
  drawFlippedObject(movableObject) {
    this.ctx.save();
    this.ctx.translate(
      movableObject.x + movableObject.width,
      movableObject.y
    );
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      movableObject.img,
      0,
      0,
      movableObject.width,
      movableObject.height
    );
    this.ctx.restore();
  }

  /**
   * Draws an object in normal orientation
   * @param {MovableObject} movableObject - Object to draw normally
   */
  drawNormalObject(movableObject) {
    movableObject.draw(this.ctx);
    movableObject.drawFrame(this.ctx);
  }

  /**
   * Triggers game over state with win or lose conditions
   * @param {boolean} playerWon - Whether the player won or lost
   */
  triggerGameOver(playerWon) {
    window.gameOver = true;
    this.stopCharacterSounds();
    this.freezeGame();
    this.audioManager.stopAllAudio();
    setTimeout(() => {
      this.showGameOverScreen(playerWon);
    }, 100);
  }

  /**
   * Stops character sounds if running
   */
  stopCharacterSounds() {
    if (this.character) {
      this.character.stopRunningSound();
      this.character.stopSleepingSound();
    }
  }

  /**
   * Shows the appropriate game over screen
   * @param {boolean} playerWon - Whether the player won or lost
   */
  showGameOverScreen(playerWon) {
    const overlayImg = document.getElementById('overlay-image');
    if (playerWon) {
      overlayImg.src = 'img/You won, you lost/You won A.png';
      this.audioManager.playWinSound();
    } else {
      overlayImg.src = 'img/You won, you lost/You lost.png';
      this.audioManager.playLostSound();
    }
    const overlay = document.getElementById('game-overlay');
    overlay.classList.remove('hidden');
  }
  
  /**
   * Freezes all game objects and stops animations when game is over
   */
  freezeGame() {
    this.gameIsOver = true;
    cancelAnimationFrame(this.animationFrame);
    this.freezeKeyboard();
    this.freezeCharacter();
    clearAllIntervals();
    this.freezeEnemies();
    this.freezeEnvironmentObjects();
  }

  /**
   * Deactivates all keyboard inputs
   */
  freezeKeyboard() {
    if (this.keyboard) {
      this.keyboard.RIGHT = false;
      this.keyboard.LEFT = false;
      this.keyboard.UP = false;
      this.keyboard.DOWN = false;
      this.keyboard.SPACE = false;
      this.keyboard.D = false;
      this.keyboard.deactivate();
    }
  }

  /**
   * Stops character movement
   */
  freezeCharacter() {
    if (this.character) {
      this.character.speedX = 0;
      this.character.speedY = 0;
    }
  }

  /**
   * Stops all enemy movements and animations
   */
  freezeEnemies() {
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach(enemy => {
        enemy.speed = 0;
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.moveInterval) clearInterval(enemy.moveInterval);
        if (enemy.attackInterval) clearInterval(enemy.attackInterval);
      });
    }
  }

  /**
   * Stops environment object movements (clouds, tumbleweeds)
   */
  freezeEnvironmentObjects() {
    if (this.level) {
      if (this.level.clouds) this.level.clouds.forEach(cloud => cloud.speed = 0);
      if (this.level.tumbleweeds) this.level.tumbleweeds.forEach(tumbleweed => tumbleweed.speed = 0);
    }
  }
}