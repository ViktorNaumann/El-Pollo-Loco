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
  hitSound = new Audio("audio/hit.mp3");
  throwSound = new Audio("audio/throw.mp3");
  breakSound = new Audio("audio/break.mp3");
  bossHurtSound = new Audio("audio/boss_hurt.mp3");
  collectSound = new Audio("audio/collect.mp3");
  squeezeChickenSound = new Audio("audio/squeeze_chicken.mp3");
  collectCoin = new Audio("audio/collect_coin.mp3");
  endbossFightMusic = new Audio("audio/endboss_fight.mp3");
  endbossMusicPlayed = false;
  winSound = new Audio("audio/win_sound.mp3");
  lostSound = new Audio("audio/lost_sound.mp3");
  lostSpeakSound = new Audio("audio/lost_speak.mp3");
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
    this.bossHurtSound.volume = 0.4;
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
      if (!this.endbossMusicPlayed) {
        if (window.backgroundMusic) {
          this.fadeOutAudio(window.backgroundMusic);
        }
        if (window.windSound) {
          this.fadeOutAudio(window.windSound);
        }
        this.endbossFightMusic.loop = true;
        if (!window.isMuted) {
          this.endbossFightMusic.volume = 0;
          this.endbossFightMusic.play()
            .then(() => this.fadeInAudio(this.endbossFightMusic, 0.2));
        }
        this.endbossMusicPlayed = true;
      }
    }
  }

  /**
   * Gradually decreases audio volume until silent
   * @param {HTMLAudioElement} audio - The audio element to fade out
   */
  fadeOutAudio(audio) {
    if (!audio || window.isMuted) return;
    const originalVolume = audio.volume;
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.pause();
        audio.volume = originalVolume;
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  /**
   * Gradually increases audio volume to target level
   * @param {HTMLAudioElement} audio - The audio element to fade in
   * @param {number} targetVolume - Target volume level
   */
  fadeInAudio(audio, targetVolume = 0.2) {
    if (!audio || window.isMuted) return;
    audio.volume = 0.05;
    const fadeInterval = setInterval(() => {
      if (window.isMuted) {
        audio.volume = 0;
        clearInterval(fadeInterval);
        return;
      }
      if (audio.volume < targetVolume - 0.05) {
        audio.volume += 0.05;
      } else {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  /**
   * Handles throwing objects when D key is pressed
   * Rate-limited to one bottle per second
   */
  checkThrowObjects() {
    const currentTime = new Date().getTime();
    const timeSinceLastThrow = currentTime - this.lastBottleThrowTime;
    const throwCooldown = 1000;
    if (this.keyboard.D && 
        this.character.collectedBottles > 0 && 
        timeSinceLastThrow >= throwCooldown) {
      this.lastBottleThrowTime = currentTime;
      this.character.collectedBottles--;
      this.statusBarBottle.setPercentage(this.character.collectedBottles * 20);
      let bottleX = this.character.otherDirection ? 
        this.character.x : 
        this.character.x + 100;
      let bottle = new ThrowableObject(
        bottleX,
        this.character.y + 100,
        this.character.otherDirection
      );
      bottle.world = this;
      window.playSound(this.throwSound, 0.3);
      this.throwableObject.push(bottle);
    }
  }

  /**
   * Main drawing method that renders all game objects to the canvas
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.level && this.level.backgroundObjects) {
      this.ctx.translate(this.camera_x, 0);
      this.addObjectsToMap(this.level.backgroundObjects);
      this.ctx.translate(-this.camera_x, 0);
    }
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.throwableObject = this.throwableObject.filter((obj) => !obj.exploded);
    this.addObjectsToMap(this.throwableObject);
    this.level.tumbleweeds.forEach(tumbleweed => {
      tumbleweed.draw(this.ctx);
    });
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
    if (this.endbossStatusBar.visible) {
      this.addToMap(this.endbossStatusBar);
    }
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
    } else {
      movableObject.draw(this.ctx);
      movableObject.drawFrame(this.ctx);
    }
  }

  /**
   * Triggers game over state with win or lose conditions
   * @param {boolean} playerWon - Whether the player won or lost
   */
  triggerGameOver(playerWon) {
    if (this.character && this.character.isRunning) {
      this.character.stopRunningSound();
    }
    this.freezeGame();
    if (this.endbossFightMusic) {
      this.fadeOutAudio(this.endbossFightMusic);
    }
    const overlayImg = document.getElementById('overlay-image');
    if (playerWon) {
      overlayImg.src = 'img/You won, you lost/You won A.png';
      window.playSound(this.winSound, 0.7);
    } else {
      overlayImg.src = 'img/You won, you lost/You lost.png';
      window.playSound(this.lostSound, 0.9);
      this.lostSound.onended = () => {
        if (!window.isMuted) {
          window.playSound(this.lostSpeakSound, 0.9);
        }
      };
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
    if (this.keyboard) {
      this.keyboard.RIGHT = false;
      this.keyboard.LEFT = false;
      this.keyboard.UP = false;
      this.keyboard.DOWN = false;
      this.keyboard.SPACE = false;
      this.keyboard.D = false;
      this.keyboard.deactivate();
    }
    if (this.character) {
      this.character.speedX = 0;
      this.character.speedY = 0;
    }
    if (window.backgroundMusic) {
      this.fadeOutAudio(window.backgroundMusic);
    }
    if (window.windSound) {
      this.fadeOutAudio(window.windSound);
    }
    clearAllIntervals();
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach(enemy => {
        enemy.speed = 0;
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.moveInterval) clearInterval(enemy.moveInterval);
        if (enemy.attackInterval) clearInterval(enemy.attackInterval);
      });
    }
    if (this.level) {
      if (this.level.clouds) this.level.clouds.forEach(cloud => cloud.speed = 0);
      if (this.level.tumbleweeds) this.level.tumbleweeds.forEach(tumbleweed => tumbleweed.speed = 0);
    }
  }
}