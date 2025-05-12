class MovableObject extends DrawableObject {
  speed = 0.1; // Speed of the object
  otherDirection = false; // Direction of the object
  speedY = 0; // Speed in Y direction
  acceleration = 2; // Acceleration in Y direction
  energy = 100; // Energy of the object
  lastHit = 0; // Last hit time

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY; // Move the object down by speedY
        this.speedY -= this.acceleration; // Increase the speedY by acceleration
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 185; // Check if the object is above ground
    }
  }

  isColliding(other) {
    const thisLeft   = this.x + this.offset.left;
    const thisRight  = this.x + this.width - this.offset.right;
    const thisTop    = this.y + this.offset.top;
    const thisBottom = this.y + this.height - this.offset.bottom;
  
    const otherLeft   = other.x + other.offset.left;
    const otherRight  = other.x + other.width - other.offset.right;
    const otherTop    = other.y + other.offset.top;
    const otherBottom = other.y + other.height - other.offset.bottom;
  
    return (
      thisRight > otherLeft &&
      thisLeft < otherRight &&
      thisBottom > otherTop &&
      thisTop < otherBottom
    );
  }
  
  
  

  hit() {
    // Immer lastHit setzen, unabhängig vom Energiestand
    this.lastHit = new Date().getTime();
    
    // Dann Energie reduzieren
    this.energy -= 20; 
    
    // Energie nicht unter 0 fallen lassen
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Calculate the time passed since the last hit
    return timepassed < 1000; // Check if the time passed is less than 1 second
  }

  isDead() {
    return this.energy == 0; // Check if the energy is 0
  }

  playAnimation(images) {
    let i = this.currentImage % images.length; // Get the current image index
    let path = images[i]; // Get the image path
    this.img.src = path; // Set the image source to the current image
    this.currentImage++; // Increment the current image index
  }

  playAnimationOnce(images) {
    let i = 0;
    let interval = setInterval(() => {
      if (i < images.length) {
        let path = images[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        clearInterval(interval);
        // Bild explizit auf dem letzten Frame halten
        let lastImage = images[images.length - 1];
        this.img = this.imageCache[lastImage];
      }
    }, 150);
  }
  
  

  moveRight() {
    this.x += this.speed; // Move right by speed
  }

  moveLeft() {
    this.x -= this.speed; // Move left by speed
  }

  jump() {
    this.speedY = 22; // Set the speedY to a positive value to move up
  }
}
