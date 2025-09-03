/**
 * CollisionHandler class
 * Handles all collisions in the game between different objects
 */
class CollisionHandler {
  /**
   * Creates a new CollisionHandler
   * @param {World} world - The game world where collisions should be detected
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Main method to check all collision types
   */
  checkCollisions() {
    if (this.world.character.isDead()) return;
    this.checkEnemyCollisions();
    this.checkBottleCollection();
    this.checkCoinCollection();
    this.world.character.previousY = this.world.character.y;
  }

  /**
   * Checks collisions with enemies
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy)) {
        if (enemy instanceof Endboss) {
          this.handleEndbossCollision(enemy);
        } else if (enemy instanceof Chicken) {
          this.handleChickenCollision(enemy);
        }
      }
    });
  }

  /**
   * Handles collisions with the endboss
   * @param {Endboss} endboss - The endboss enemy
   */
  handleEndbossCollision(endboss) {
    if (!this.world.character.isHurt()) {
      this.world.character.hit(20);
      this.world.audioManager.playHitSound();
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Handles collisions with chickens
   * @param {Chicken} chicken - The chicken object
   */
  handleChickenCollision(chicken) {
    if (chicken.hasBeenHit || chicken.isBeingRemoved) {
      return;
    }
    if (this.isJumpingOnChicken(chicken)) {
      this.handleChickenJump(chicken);
      return;
    }
    this.applyCharacterDamage();
  }

  /**
   * Checks if character is jumping on chicken
   * @param {Chicken} chicken - The chicken object
   * @returns {boolean} True if jumping on chicken
   */
  isJumpingOnChicken(chicken) {
    const characterBottom = this.world.character.y + this.world.character.height;
    const characterPrevBottom = this.world.character.previousY + this.world.character.height;
    const enemyTop = chicken.y;
    const wasAboveEnemy = characterPrevBottom <= enemyTop + 10;
    const isNowAtOrBelowEnemy = characterBottom >= enemyTop - 5;
    return wasAboveEnemy && isNowAtOrBelowEnemy && this.hasHorizontalOverlap(chicken);
  }

  /**
   * Checks if character horizontally overlaps with chicken
   * @param {Chicken} chicken - The chicken object
   * @returns {boolean} True if overlapping horizontally
   */
  hasHorizontalOverlap(chicken) {
    return this.world.character.x + this.world.character.width - 30 > chicken.x + 10 &&
           this.world.character.x + 30 < chicken.x + chicken.width - 10;
  }

  /**
   * Applies damage to character
   */
  applyCharacterDamage() {
    if (!this.world.character.isHurt()) {
      this.world.character.hit(20);
      this.world.audioManager.playHitSound();
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Handles jumping on a chicken
   * @param {Chicken} chicken - The chicken that was jumped on
   */
  handleChickenJump(chicken) {
    chicken.hasBeenHit = true;
    chicken.isBeingRemoved = true;
    this.world.audioManager.playSqueezeChickenSound();
    chicken.die();
    this.removeChickenAfterDelay(chicken);
    this.world.character.speedY = 17;
  }

  /**
   * Removes chicken from enemies array after delay
   * @param {Chicken} chicken - The chicken to remove
   */
  removeChickenAfterDelay(chicken) {
    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(chicken);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Checks if the character is jumping on an enemy
   * @param {MovableObject} enemy - The enemy to check
   * @returns {boolean} True if character is jumping on the enemy from above
   */
  isCharacterJumpingOnEnemy(enemy) {
    if (!this.isCharacterInJumpingState()) {
      return false;
    }
    if (!this.isHorizontallyAligned(enemy)) {
      return false;
    }
    return this.isInJumpRange(enemy);
  }

  /**
   * Checks if character is in jumping state
   * @returns {boolean} True if character is jumping
   */
  isCharacterInJumpingState() {
    const isPhysicallyJumping = this.world.character.isAboveGround();
    const isStartingJump = this.world.character.speedY < -15;
    const isJumping = isPhysicallyJumping || isStartingJump;
    return isJumping && this.world.character.speedY < 0;
  }

  /**
   * Checks if character is horizontally aligned with enemy
   * @param {MovableObject} enemy - The enemy to check
   * @returns {boolean} True if horizontally aligned
   */
  isHorizontallyAligned(enemy) {
    const characterLeft = this.world.character.x + 40;
    const characterRight = this.world.character.x + this.world.character.width - 40;
    const enemyLeft = enemy.x + 10;
    const enemyRight = enemy.x + enemy.width - 10;
    return !(characterRight < enemyLeft || characterLeft > enemyRight);
  }

  /**
   * Checks if character is in jump range of enemy
   * @param {MovableObject} enemy - The enemy to check
   * @returns {boolean} True if in jump range
   */
  isInJumpRange(enemy) {
    const characterFeet = this.world.character.y + this.world.character.height;
    const enemyTop = enemy.y + 10;
    const verticalDistance = characterFeet - enemyTop;
    const tolerance = enemy instanceof Chicken && enemy.height <= 60 ? 45 : 80;
    return verticalDistance > -10 && verticalDistance < tolerance;
  }

  /**
   * Handles damage to character
   */
  handleCharacterDamage() {
    if (!this.world.character.isHurt()) {
      this.world.character.hit(5);
      this.world.audioManager.playHitSound();
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Checks collisions with collectible bottles
   */
  checkBottleCollection() {
    for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.world.level.bottles[i];
      if (this.world.character.isColliding(bottle) && this.world.character.collectedBottles < 5) {
        this.collectBottle(i, bottle);
      }
    }
  }

  /**
   * Handles bottle collection logic
   * @param {number} index - Index of bottle in array
   * @param {Object} bottle - The bottle object
   */
  collectBottle(index, bottle) {
    this.world.level.bottles.splice(index, 1);
    this.world.character.collectedBottles++;
    this.world.statusBarBottle.setPercentage(this.world.character.collectedBottles * 20);
    this.world.audioManager.playCollectSound();
  }

  /**
   * Checks collisions with collectible coins
   */
  checkCoinCollection() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
      const coin = this.world.level.coins[i];
      if (this.world.character.isColliding(coin)) {
        this.collectCoin(i);
      }
    }
  }

  /**
   * Handles coin collection logic
   * @param {number} index - Index of coin in array
   */
  collectCoin(index) {
    this.world.level.coins.splice(index, 1);
    this.world.collectedCoins++;
    this.world.statusBarCoin.setPercentage(this.world.collectedCoins * 5);
    this.world.audioManager.playCollectCoinSound();
  }

  /**
   * Checks collisions between thrown bottles and enemies
   */
  checkBottleHits() {
    this.world.throwableObject.forEach((bottle) => {
      this.world.level.enemies.forEach((enemy) => {
        if (this.isBottleHittingEnemy(bottle, enemy)) {
          this.handleBottleHit(bottle, enemy);
        }
      });
    });
  }

  /**
   * Checks if bottle is hitting enemy
   * @param {Object} bottle - The thrown bottle
   * @param {Object} enemy - The enemy object
   * @returns {boolean} True if bottle hits enemy
   */
  isBottleHittingEnemy(bottle, enemy) {
    return bottle.isColliding(enemy) && !bottle.exploded && !bottle.hasHit;
  }

  /**
   * Handles bottle hitting enemy
   * @param {Object} bottle - The thrown bottle
   * @param {Object} enemy - The enemy object
   */
  handleBottleHit(bottle, enemy) {
    bottle.explode();
    bottle.hasHit = true;
    if (enemy instanceof Endboss) {
      this.handleEndbossHit(enemy);
    } else if (enemy instanceof Chicken) {
      this.handleChickenHit(enemy);
    }
  }

  /**
   * Handles endboss being hit by bottle
   * @param {Endboss} enemy - The endboss enemy
   */
  handleEndbossHit(enemy) {
    enemy.hit(20);
    this.world.endbossStatusBar.setPercentage(enemy.energy);
  }

  /**
   * Handles chicken being hit by bottle
   * @param {Chicken} enemy - The chicken enemy
   */
  handleChickenHit(enemy) {
    enemy.die();
    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(enemy);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 500);
  }
}