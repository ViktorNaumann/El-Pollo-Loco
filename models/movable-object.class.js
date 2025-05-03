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
    return this.y < 185; // Check if the object is above ground
  }

  isColliding(movableObject) {
    return this.x + this.width > movableObject.x && 
      this.y + this.height > movableObject.y && 
      this.x < movableObject.x + movableObject.width &&
      this.y < movableObject.y + movableObject.height;
  }

  hit() {
    this.energy -= 5; // Decrease energy by 5
    if (this.energy < 0) {
      this.energy = 0; // Set energy to 0 if it goes below 0
    } else {
      this.lastHit = new Date().getTime(); // Set the last hit time to the current time
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Calculate the time passed since the last hit
    return timepassed < 500; // Check if the time passed is less than 1 second
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

  moveRight() {
    this.x += this.speed; // Move right by speed
  }

  moveLeft() {
    this.x -= this.speed; // Move left by speed
  }

  jump() {
    this.speedY = 30; // Set the speedY to a positive value to move up
  }
}
