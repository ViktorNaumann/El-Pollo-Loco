class Endboss extends MovableObject {
  height = 400;
  width = 300;
  y = 50;
  speed = 3.5;

 
  offset = {
    top: 100,
    left: 50,
    right: 50,
    bottom: 20,
  };

  IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',

  ];

  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 3900;
    this.animate();
  }

  animate() {
    // Animationen steuern (hurt, dead, idle)
    this.animationInterval = setInterval(() => {
        if (this.isDead() && !this.deadPlayed) {
          clearInterval(this.animationInterval);
          this.playAnimationOnce(this.IMAGES_DEAD);
          this.deadPlayed = true;
        } else if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
        } else if (this.isActive && !this.isDead()) {
          this.playAnimation(this.IMAGES_WALKING); // ✅ hier einfügen!
        } else {
          this.playAnimation(this.IMAGES_ALERT);
        }
      }, 150);
  
    // Bewegung, wenn aktiv
    this.moveInterval = setInterval(() => {
      if (this.isActive && !this.isDead()) {
        this.followCharacter();
      }
    }, 1000 / 30);
  
    // Angriff prüfen
    this.attackInterval = setInterval(() => {
      if (this.isActive && !this.isDead()) {
        this.attackPlayer();
      }
    }, 1000 / 10); // 10x pro Sekunde prüfen
  }
  

  shakeAnimation() {
    const originalX = this.x;
    let offset = 15;
    let i = 0;
    let interval = setInterval(() => {
      this.x = originalX + (i % 2 === 0 ? -offset : offset);
      i++;
      if (i > 4) {
        clearInterval(interval);
        this.x = originalX;
      }
    }, 50);
  }
  
  

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 1000;
  }

  isDead() {
    return this.energy <= 0;
  }

  hit(damage = 20) {
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = new Date().getTime();
  
    this.shakeAnimation(); // 🔁 sichtbar wackeln
  
    if (this.world && this.world.bossHurtSound) {
      this.world.bossHurtSound.currentTime = 0;
      this.world.bossHurtSound.play();
    }
  }

  attackPlayer() {
    if (!this.world || !this.world.character || this.isDead()) return;
  
    if (this.isColliding(this.world.character)) {
      this.playAnimation(this.IMAGES_ATTACK);
      this.world.character.hit();
      this.world.statusBar.setPercentage(this.world.character.energy);
  
      if (this.world.character.energy <= 0) {
        this.world.triggerGameOver();
      }
    }
  }  

  followCharacter() {
    if (!this.world || !this.world.character) return;
  
    const char = this.world.character;
  
    if (this.x - char.x > 10) {
      this.otherDirection = false; // 🔁 Boss schaut nach rechts (weil Bilder so sind)
      this.x -= this.speed;
    } else {
        this.attackPlayer(); // oder: aktiv angreifen statt nur in Intervall
      }
      
  }
  
  
  
  
  
}
