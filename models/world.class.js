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
  endbossFightMusic = new Audio("audio/endboss_fight.mp3");
  endbossMusicPlayed = false; // Flag für einmalige Aktivierung
  winSound = new Audio("audio/win_sound.mp3");
  lostSound = new Audio("audio/lost_sound.mp3");
  lostSpeakSound = new Audio("audio/lost_speak.mp3");

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level || initLevel(); // Fallback wenn kein Level übergeben wird
    this.endbossStatusBar.visible = false;
    
    // Coin-Statusbar explizit auf 0% setzen
    this.statusBarCoin.setPercentage(0);
    
    
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
      
      // Endboss-Musik nur einmal abspielen
      if (!this.endbossMusicPlayed) {
        
        // Sanfteres Ausblenden der normalen Musik
        if (window.backgroundMusic) {
          this.fadeOutAudio(window.backgroundMusic);
        }
        if (window.windSound) {
          this.fadeOutAudio(window.windSound);
        }
        
        // Endboss-Kampfmusik einblenden und abspielen 
        this.endbossFightMusic.loop = true;
        
        // NUR abspielen, wenn nicht stummgeschaltet
        if (!window.isMuted) {
          this.endbossFightMusic.volume = 0;
          this.endbossFightMusic.play()
            .then(() => this.fadeInAudio(this.endbossFightMusic, 0.2));
        }
        
        this.endbossMusicPlayed = true;
      }
    }
  }

  // Hilfsmethode zum sanften Ausblenden von Audio
  fadeOutAudio(audio) {
    if (!audio || window.isMuted) return;
    
    const originalVolume = audio.volume;
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.pause();
        audio.volume = originalVolume; // Für späteren Gebrauch
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  // Hilfsmethode zum sanften Einblenden von Audio
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

  checkBottleHits() {
    this.throwableObject.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy) && !bottle.exploded && !bottle.hasHit) { // Neuer Check mit hasHit
                bottle.explode();
                bottle.hasHit = true; // Markiere die Flasche als "getroffen"
                
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
        // Nutze window.playSound statt direktem Aufruf
        window.playSound(this.throwSound, 0.3);
        this.throwableObject.push(bottle);
    }
  }

  // Die Hauptmethode für alle Kollisionen
  checkCollisions() {
    // Früher Return bei totem Character
    if (this.character.isDead()) return;
    
    this.checkEnemyCollisions();
    this.checkBottleCollection();
    this.checkCoinCollection();
    
    // Position für die nächste Kollisionsprüfung speichern
    this.character.previousY = this.character.y;
  }

  // Hauptmethode für Feindkollisionen
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
            if (enemy instanceof Endboss) {
                this.handleEndbossCollision(enemy);
            } else if (enemy instanceof Chicken) {
                this.handleChickenCollision(enemy);
            }
        }
    });
}

// Behandelt Kollisionen mit dem Endboss
handleEndbossCollision(endboss) {
    // Immunitätsprüfung hinzufügen
    if (!this.character.isHurt()) {
        // hit() Methode verwenden statt direkter Manipulation
        this.character.hit(20);
        
        // Sound abspielen mit window.playSound
        window.playSound(this.hitSound, 0.4);
        
        // Statusbar aktualisieren
        this.statusBar.setPercentage(this.character.energy);
    }
}

// Behandelt Kollisionen mit Chickens
handleChickenCollision(chicken) {
    // Prüfe, ob Character auf Chicken springt
    const isJumpingOnTop = this.isCharacterJumpingOnEnemy(chicken);
    
    if (isJumpingOnTop) {
        // Character springt auf Chicken
        this.handleChickenJumpedOn(chicken);
    } else {
        // Chicken trifft Character von der Seite
        if (!this.character.isHurt()) {
            // Character erhält Schaden - von 5 auf 20 erhöht
            this.character.hit(20);
            
            // Sound abspielen mit window.playSound
            window.playSound(this.hitSound, 0.3);
            
            // Status Bar aktualisieren
            this.statusBar.setPercentage(this.character.energy);
        }
    }
}

// Prüft ob Character auf Gegner springt
isCharacterJumpingOnEnemy(enemy) {
    return this.character.speedY < 0 && 
           this.character.previousY + this.character.height - this.character.offset.bottom <= enemy.y + enemy.offset.top && 
           this.character.x + this.character.width - this.character.offset.right > enemy.x + enemy.offset.left && 
           this.character.x + this.character.offset.left < enemy.x + enemy.width - enemy.offset.right;
}

// Behandelt Chicken-Eliminierung durch Sprung
handleChickenJumpedOn(chicken) {
    // Sound mit window.playSound abspielen
    window.playSound(this.squeezeChickenSound, 0.3);
    
    chicken.die();
    setTimeout(() => {
        const index = this.level.enemies.indexOf(chicken);
        if (index !== -1) {
            this.level.enemies.splice(index, 1);
        }
    }, 300);
    
    this.character.speedY = 17; // Bounce-Effekt
}

// Behandelt Schaden am Character
handleCharacterDamage() {
    if (!this.character.isHurt()) {
        this.character.hit(5);
        
        // Sound abspielen mit window.playSound
        window.playSound(this.hitSound, 0.3);
        
        this.statusBar.setPercentage(this.character.energy);
    }
}

  // Prüft Kollisionen mit Coins
  checkCoinCollection() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
        const coin = this.level.coins[i];
        if (this.character.isColliding(coin)) {
            // Coin einsammeln
            this.level.coins.splice(i, 1);
            this.collectedCoins++;
            this.statusBarCoin.setPercentage(this.collectedCoins * 5);
            
            // Sound mit window.playSound abspielen - hier collectCoin verwenden
            window.playSound(this.collectCoin, 0.3);
        }
    }
  }

  // Prüft Kollisionen mit Flaschen
  checkBottleCollection() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
        const bottle = this.level.bottles[i];
        if (this.character.isColliding(bottle) && this.character.collectedBottles < 5) {
            // Flasche einsammeln
            this.level.bottles.splice(i, 1);
            this.character.collectedBottles++;
            this.statusBarBottle.setPercentage(this.character.collectedBottles * 20);
            // Sound mit window.playSound abspielen
            window.playSound(this.collectSound, 0.3);
        }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Überprüfen, ob this.level und seine Eigenschaften existieren
    if (this.level && this.level.backgroundObjects) {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
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

    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin); // ✅ Coins zeichnen

    if (this.endbossStatusBar.visible) {
      this.addToMap(this.endbossStatusBar);
    }

    this.animationFrame = requestAnimationFrame(() => {
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

  triggerGameOver(playerWon) {
    // Character Laufsound stoppen - NEU HINZUGEFÜGT
    if (this.character && this.character.isRunning) {
      this.character.stopRunningSound();
    }
    
    // Alle beweglichen Objekte anhalten
    this.freezeGame();
    
    // Hintergrundmusik stoppen
    if (this.endbossFightMusic) {
      this.fadeOutAudio(this.endbossFightMusic);
    }
    
    // Das richtige Overlay-Bild setzen und Sound abspielen
    const overlayImg = document.getElementById('overlay-image');
    if (playerWon) {
      // Gewonnen
      overlayImg.src = 'img/You won, you lost/You won A.png';
      
      // Sieges-Sound abspielen mit window.playSound
      window.playSound(this.winSound, 0.7);
    } else {
      // Verloren
      overlayImg.src = 'img/You won, you lost/You lost.png';
      
      // Verloren-Sound abspielen mit window.playSound
      window.playSound(this.lostSound, 0.9);
      
      // Nach dem ersten Sound den Sprachsound abspielen
      this.lostSound.onended = () => {
        if (!window.isMuted) {
          window.playSound(this.lostSpeakSound, 0.9);
        }
      };
    }
    
    // Overlay anzeigen
    const overlay = document.getElementById('game-overlay');
    overlay.classList.remove('hidden');
  }
  
  freezeGame() {
    // Spiel-Flag setzen
    this.gameIsOver = true;
    
    // Animation-Frame stoppen
    cancelAnimationFrame(this.animationFrame);
    
    // Tastatur deaktivieren
    if (this.keyboard) {
      // Alle Tasten auf false setzen
      this.keyboard.RIGHT = false;
      this.keyboard.LEFT = false;
      this.keyboard.UP = false;
      this.keyboard.DOWN = false;
      this.keyboard.SPACE = false;
      this.keyboard.D = false;
      
      // Tastatur-Events deaktivieren
      this.keyboard.deactivate();
    }
    
    // Bewegliche Objekte anhalten
    if (this.character) {
      this.character.speedX = 0;
      this.character.speedY = 0;
    }
    
    // Alle Intervalle stoppen
    clearAllIntervals();
    
    // Alle Chickens und den Endboss anhalten
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach(enemy => {
        enemy.speed = 0;
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.moveInterval) clearInterval(enemy.moveInterval);
        if (enemy.attackInterval) clearInterval(enemy.attackInterval);
      });
    }
    
    // Wolken und Tumbleweeds anhalten
    if (this.level) {
      if (this.level.clouds) this.level.clouds.forEach(cloud => cloud.speed = 0);
      if (this.level.tumbleweeds) this.level.tumbleweeds.forEach(tumbleweed => tumbleweed.speed = 0);
    }
  }
}
