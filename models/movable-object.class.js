class MovableObject {
  x = 80;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.1; // Speed of the object
  otherDirection = false; // Direction of the object
  speedY = 0; // Speed in Y direction
  acceleration = 2; // Acceleration in Y direction

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // Draw the image at the specified position and size
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
    }
  }
  // loadImage('img/test.png);
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
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
