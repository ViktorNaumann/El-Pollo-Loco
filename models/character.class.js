class Character extends MovableObject {
  height = 250;
  width = 130;
  x = 100;
  y = 85;
  speed = 10;

  IMAGES_RIGHT = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    super.loadImages(this.IMAGES_RIGHT);
    this.applyGravity(); // Apply gravity to the character
    this.animate();
  }

  animate() {

    setInterval(() => {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed; // Move right by speed
            this.otherDirection = false; // Set the direction to right
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.x -= this.speed; // Move left by speed
            this.otherDirection = true; // Set the direction to left
        }
        if (this.world.keyboard.UP) {
            this.y -= this.speed; // Move up by speed
        }
        this.world.camera_x = -this.x + 100; // Move the camera to the left
    }
    , 1000 / 60); // 60 FPS


    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {	
        // Walk animation
        this.playAnimation(this.IMAGES_RIGHT);
      }
    }, 50);
  }

  jump() {}
}
