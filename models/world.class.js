class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  statusBar = new StatusBar(); // für Spieler
  statusBarBottle = new StatusBar("bottle"); // für Flaschen
  endbossStatusBar = new StatusBar("endboss"); // für Endboss
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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.endbossStatusBar.visible = false;
    this.draw();
    this.setWorld();
    this.run();
    this.bossHurtSound.volume = 0.4;
  }

  setWorld() {
    this.character.world = this;

    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkBottleHits();
      this.checkEndbossVisibility(); // ✅ neu
    }, 200);
  }

  checkEndbossVisibility() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!boss) return;

    const bossLeft = boss.x;
    const bossRight = boss.x + boss.width;
    const cameraLeft = -this.camera_x;
    const cameraRight = -this.camera_x + this.canvas.width;

    if (bossLeft >= cameraLeft && bossRight <= cameraRight) {
      this.endbossStatusBar.visible = true;
      boss.isVisible = true; // Endboss sichtbar
      boss.isActive = true; // Endboss aktiv
    }
  }

  checkBottleHits() {
    this.throwableObject.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy) && !bottle.exploded) {
                // Flasche explodiert
                bottle.explode();
                
                if (enemy instanceof Endboss) {
                    enemy.hit(20);
                    this.endbossStatusBar.setPercentage(enemy.energy);
                } else if (enemy instanceof Chicken) {
                    enemy.die(); // Chicken stirbt mit Animation
                    setTimeout(() => {
                        const index = this.level.enemies.indexOf(enemy);
                        if (index !== -1) {
                            this.level.enemies.splice(index, 1);
                        }
                    }, 500); // Wartezeit für die Todesanimation
                }
            }
        });
    });
}

  checkThrowObjects() {
    if (this.keyboard.D && this.character.collectedBottles > 0) {
        this.character.collectedBottles--;
        this.statusBarBottle.setPercentage(this.character.collectedBottles * 20);

        // Startposition der Flasche anpassen basierend auf Richtung
        let bottleX = this.character.otherDirection ? 
            this.character.x : // Wenn nach links schauend
            this.character.x + 100; // Wenn nach rechts schauend

        let bottle = new ThrowableObject(
            bottleX,
            this.character.y + 100,
            this.character.otherDirection // Übergebe die Richtung
        );
        
        bottle.world = this;
        this.throwSound.currentTime = 0;
        this.throwSound.play();
        this.throwSound.volume = 0.3;
        this.throwableObject.push(bottle);
    }
  }

  checkCollisions() {
    let enemiesToRemove = [];

    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        const characterBottom =
          this.character.y +
          this.character.height -
          this.character.offset.bottom;
        const characterPrevBottom =
          this.character.previousY +
          this.character.height -
          this.character.offset.bottom;
        const enemyTop = enemy.y;

        const horizontallyOverlaps =
          this.character.x +
            this.character.width -
            this.character.offset.right >
            enemy.x &&
          this.character.x + this.character.offset.left < enemy.x + enemy.width;

        const landedOnEnemy =
          characterPrevBottom <= enemyTop &&
          characterBottom >= enemyTop &&
          horizontallyOverlaps;

        if (landedOnEnemy && enemy instanceof Chicken) {
          this.squeezeChickenSound.currentTime = 0;
          this.squeezeChickenSound.play();
          this.squeezeChickenSound.volume = 0.3;
          enemy.die();
          enemiesToRemove.push(enemy); // merken für später
          this.character.jump();
          this.character.speedY = 20;
        } else {
          this.character.hit();
          this.hitSound.play();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });

    // Nachträglich tote Hühner entfernen
    enemiesToRemove.forEach((enemy) => {
      setTimeout(() => {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) {
          this.level.enemies.splice(index, 1);
        }
      }, 300); // ggf. 300ms sichtbar bleiben
    });

    // Flaschen sammeln wie vorher
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        if (this.character.collectedBottles < 5) {
          this.character.collectedBottles++;
          this.statusBarBottle.setPercentage(
            this.character.collectedBottles * 20
          );
          this.collectSound.currentTime = 0;
          this.collectSound.play();
          return false;
        }
      }
      return true;
    });

    this.character.previousY = this.character.y;

    // Coins sammeln
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        // Erhöhe auf z.B. 20 coins
        if (this.collectedCoins < 20) {  // Hier von 5 auf 20 erhöht
            this.collectedCoins++;
            this.statusBarCoin.setPercentage(this.collectedCoins * 5);  // Von 20 auf 5 geändert
            this.collectCoin.currentTime = 0;
            this.collectCoin.play();
            return false;
        }
      }
      return true;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin); // ✅ Coins zeichnen

    if (this.endbossStatusBar.visible) {
      this.addToMap(this.endbossStatusBar);
    }

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins); // ✅ Coins zeichnen
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);

    this.throwableObject = this.throwableObject.filter((obj) => !obj.exploded);
    this.addObjectsToMap(this.throwableObject);

    this.level.tumbleweeds.forEach(tumbleweed => {
      tumbleweed.draw(this.ctx);
    });

    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

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

  triggerGameOver() {
    this.gameOver = true;
    setTimeout(() => {
      alert("GAME OVER!");
      location.reload(); // Spiel neu laden
    }, 1000);
  }
}
