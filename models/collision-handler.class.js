/**
 * CollisionHandler Klasse
 * Verarbeitet alle Kollisionen im Spiel zwischen verschiedenen Objekten
 */
class CollisionHandler {
  /**
   * Erzeugt einen neuen CollisionHandler
   * @param {World} world - Die Spielwelt, in der die Kollisionen erkannt werden sollen
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Hauptmethode zur Überprüfung aller Kollisionstypen
   */
  checkCollisions() {
    if (this.world.character.isDead()) return;
    this.checkEnemyCollisions();
    this.checkBottleCollection();
    this.checkCoinCollection();
    this.world.character.previousY = this.world.character.y;
  }

  /**
   * Überprüft Kollisionen mit Feinden
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
   * Behandelt Kollisionen mit dem Endboss
   * @param {Endboss} endboss - Der Endboss-Gegner
   */
  handleEndbossCollision(endboss) {
    if (!this.world.character.isHurt()) {
      this.world.character.hit(20);
      window.playSound(this.world.hitSound, 0.4);
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Behandelt Kollisionen mit Hühnern
   * @param {Chicken} chicken - Das Huhn-Objekt
   */
  handleChickenCollision(chicken) {
    if (chicken.hasBeenHit || chicken.isBeingRemoved) {
      return;
    }
    const characterBottom = this.world.character.y + this.world.character.height;
    const characterPrevBottom = this.world.character.previousY + this.world.character.height;
    const enemyTop = chicken.y;
    const wasAboveEnemy = characterPrevBottom <= enemyTop + 10;
    const isNowAtOrBelowEnemy = characterBottom >= enemyTop - 5;
    const horizontallyOverlaps = 
      this.world.character.x + this.world.character.width - 30 > chicken.x + 10 &&
      this.world.character.x + 30 < chicken.x + chicken.width - 10;
    if (wasAboveEnemy && isNowAtOrBelowEnemy && horizontallyOverlaps) {
      this.handleChickenJump(chicken);
      return;
    }
    if (!this.world.character.isHurt()) {
      this.world.character.hit(20);
      window.playSound(this.world.hitSound, 0.3);
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Behandelt das Springen auf ein Huhn
   * @param {Chicken} chicken - Das Huhn, auf das gesprungen wurde
   */
  handleChickenJump(chicken) {
    chicken.hasBeenHit = true;
    chicken.isBeingRemoved = true;
    window.playSound(this.world.squeezeChickenSound, 0.3);
    chicken.die();
    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(chicken);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 300);
    this.world.character.speedY = 17;
  }

  /**
   * Überprüft, ob der Charakter auf einen Feind springt
   * @param {MovableObject} enemy - Der zu überprüfende Feind
   * @returns {boolean} Wahr, wenn der Charakter von oben auf den Feind springt
   */
  isCharacterJumpingOnEnemy(enemy) {
    const jumpKeyPressed = this.world.keyboard.SPACE || this.world.keyboard.UP;
    const wasJustJumping = this.world.character.speedY < -25;
    const isPhysicallyJumping = this.world.character.isAboveGround();
    const isStartingJump = this.world.character.speedY < -15;
    const isJumping = isPhysicallyJumping || isStartingJump;
    if (!isJumping) {
      return false;
    }
    if (this.world.character.speedY >= 0) {
      return false;
    }
    const characterLeft = this.world.character.x + 40;
    const characterRight = this.world.character.x + this.world.character.width - 40;
    const enemyLeft = enemy.x + 10;
    const enemyRight = enemy.x + enemy.width - 10;
    if (characterRight < enemyLeft || characterLeft > enemyRight) {
      return false;
    }
    const characterFeet = this.world.character.y + this.world.character.height;
    const enemyTop = enemy.y + 10;
    const verticalDistance = characterFeet - enemyTop;
    const tolerance = enemy instanceof Chicken && enemy.height <= 60 ? 45 : 80;
    const isInJumpRange = verticalDistance > -10 && verticalDistance < tolerance;
    
    return isInJumpRange;
  }

  /**
   * Behandelt Schaden am Charakter
   */
  handleCharacterDamage() {
    if (!this.world.character.isHurt()) {
      this.world.character.hit(5);
      window.playSound(this.world.hitSound, 0.3);
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Überprüft Kollisionen mit sammelbaren Flaschen
   */
  checkBottleCollection() {
    for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.world.level.bottles[i];
      if (this.world.character.isColliding(bottle) && this.world.character.collectedBottles < 5) {
        this.world.level.bottles.splice(i, 1);
        this.world.character.collectedBottles++;
        this.world.statusBarBottle.setPercentage(this.world.character.collectedBottles * 20);
        window.playSound(this.world.collectSound, 0.3);
      }
    }
  }

  /**
   * Überprüft Kollisionen mit sammelbaren Münzen
   */
  checkCoinCollection() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
      const coin = this.world.level.coins[i];
      if (this.world.character.isColliding(coin)) {
        this.world.level.coins.splice(i, 1);
        this.world.collectedCoins++;
        this.world.statusBarCoin.setPercentage(this.world.collectedCoins * 5);
        window.playSound(this.world.collectCoin, 0.3);
      }
    }
  }

  /**
   * Überprüft Kollisionen zwischen geworfenen Flaschen und Feinden
   */
  checkBottleHits() {
    this.world.throwableObject.forEach((bottle) => {
      this.world.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.exploded && !bottle.hasHit) {
          bottle.explode();
          bottle.hasHit = true;
          if (enemy instanceof Endboss) {
            enemy.hit(20);
            this.world.endbossStatusBar.setPercentage(enemy.energy);
          } else if (enemy instanceof Chicken) {
            enemy.die();
            setTimeout(() => {
              const index = this.world.level.enemies.indexOf(enemy);
              if (index !== -1) {
                this.world.level.enemies.splice(index, 1);
              }
            }, 500);
          }
        }
      });
    });
  }
}