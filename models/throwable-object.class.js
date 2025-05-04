class ThrowableObject extends MovableObject {
    IMAGES_ROTATE = [
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];
  
    IMAGES_SPLASH = [
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];
  
    constructor(x, y) {
      super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
      this.x = x;
      this.y = y;
      this.height = 60;
      this.width = 50;
      this.trow();
      this.loadImages(this.IMAGES_ROTATE);
      this.loadImages(this.IMAGES_SPLASH);
      this.animateRotation();
    }
  
    applyGravity() {
      let gravityInterval = setInterval(() => {
        if (this.exploded) {
          clearInterval(gravityInterval);
          return;
        }
  
        if (this.y < 350) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        } else {
          this.y = 350;
          this.explode();
          clearInterval(gravityInterval);
        }
      }, 1000 / 25);
    }
  
    animateRotation() {
      let interval = setInterval(() => {
        if (this.exploded || this.isSplashing) {
          clearInterval(interval);
        } else {
          this.playAnimation(this.IMAGES_ROTATE);
        }
      }, 50);
    }
  
    explode() {
      if (this.exploding) return;
      this.exploding = true;
      this.speedY = 0;
      this.speed = 0;
      this.isSplashing = true;
  
      if (this.throwInterval) clearInterval(this.throwInterval);
  
      this.animateSplash();
  
      if (this.world && this.world.breakSound) {
        this.world.breakSound.currentTime = 0;
        this.world.breakSound.play();
      }
  
      let splashDuration = this.IMAGES_SPLASH.length * 500;
      setTimeout(() => {
        this.exploded = true;
      }, splashDuration);
    }
  
    animateSplash() {
      let i = 0;
      let splashInterval = setInterval(() => {
        if (i < this.IMAGES_SPLASH.length) {
          let path = this.IMAGES_SPLASH[i];
          let img = this.imageCache[path];
          if (img) this.img = img;
          i++;
        } else {
          clearInterval(splashInterval);
        }
      }, 150);
    }
  
    trow() {
      this.speedY = 30;
      this.applyGravity();
      this.throwInterval = setInterval(() => {
        this.x += 10;
      }, 25);
    }
  }
  
