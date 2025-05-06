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

  hitSound = new Audio("audio/hit.mp3");
  throwSound = new Audio("audio/throw.mp3");
  breakSound = new Audio("audio/break.mp3");
  bossHurtSound = new Audio('audio/boss_hurt.mp3');


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
    const boss = this.level.enemies.find(e => e instanceof Endboss);
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
          bottle.exploded = true; // ❗ verhindert Mehrfachsound
          this.breakSound.currentTime = 0;
          this.breakSound.play();
          bottle.explode();
  
          if (enemy instanceof Endboss) {
            enemy.hit(20);
            this.endbossStatusBar.setPercentage(enemy.energy);
          }
        }
      });
    });
  }
  

  checkThrowObjects() {
    if (this.keyboard.D && this.character.collectedBottles > 0) {
      this.character.collectedBottles--;
      this.statusBarBottle.setPercentage(this.character.collectedBottles * 20);
  
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      bottle.world = this;
      this.throwSound.currentTime = 0;
      this.throwSound.play();
      this.throwSound.volume = 0.3;
      this.throwableObject.push(bottle);
  }
  
  
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
    if (this.character.isColliding(enemy)) {
      console.log('🟥 Kollision erkannt mit: ', enemy);

      const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
      const characterPrevBottom = this.character.previousY + this.character.height - this.character.offset.bottom;
      const enemyTop = enemy.y;

      const horizontallyOverlaps =
        this.character.x + this.character.width - this.character.offset.right > enemy.x &&
        this.character.x + this.character.offset.left < enemy.x + enemy.width;

      const landedOnEnemy =
        characterPrevBottom <= enemyTop &&
        characterBottom >= enemyTop &&
        horizontallyOverlaps;

      console.log('🟦 characterBottom:', characterBottom);
      console.log('🟩 enemyTop:', enemyTop);
      console.log('↔️ Horizontal über Gegner?', horizontallyOverlaps);
      console.log('⬇️ Bottom trifft Top? (landedOnEnemy)', landedOnEnemy);

      if (landedOnEnemy) {
        console.log('✅ Gegner wird besiegt!');
        this.level.enemies.splice(index, 1);
      } else {
        console.log('❗ Charakter nimmt Schaden');
        this.character.hit();
        this.hitSound.play();
        this.statusBar.setPercentage(this.character.energy);
      }
    }
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
          this.character.collectedBottles = (this.character.collectedBottles || 0) + 1;
          this.statusBarBottle.setPercentage(this.character.collectedBottles * 20); // 5 Flaschen = 100%
          return false;
      }
      return true;
  });
  
  
  });

  // Am Ende die aktuelle Y-Position speichern
  this.character.previousY = this.character.y;
} 
  

  

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);

    if (this.endbossStatusBar.visible) {
      this.addToMap(this.endbossStatusBar);
    }

    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);

    this.throwableObject = this.throwableObject.filter(obj => !obj.exploded);
    this.addObjectsToMap(this.throwableObject);

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
      this.ctx.translate(movableObject.x + movableObject.width, movableObject.y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(movableObject.img, 0, 0, movableObject.width, movableObject.height);
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

