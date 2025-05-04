class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // Initial camera position
  statusBar = new StatusBar(); // Create a new status bar instance
  throwableObject = []; // Create a new throwable object instance

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisitions();
      this.checkThrowObjects(); // Check for throwable objects
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100); // Create a new throwable object
      this.throwableObject.push(bottle); // Add the new object to the array
    }
  }

  checkCollisitions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit(); // Call the hit method on the character
        this.statusBar.setPercentage(this.character.energy); // Update the status bar percentage
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0); // Move the camera to the left

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
      movableObject.draw(this.ctx); // Draw the object
      movableObject.drawFrame(this.ctx); // Draw the frame
    }
  }
}
