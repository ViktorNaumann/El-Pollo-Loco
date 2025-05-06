class Character extends MovableObject {
  height = 250;
  width = 130;
  x = 100;
  y = 85;
  speed = 10;
  offset = {
    top: 120,  
    left: 40,
    right: 40,
    bottom: 10,
  };


  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    super.loadImages(this.IMAGES_WALKING);
    super.loadImages(this.IMAGES_JUMPING);
    super.loadImages(this.IMAGES_DEAD);
    super.loadImages(this.IMAGES_HURT);
    
    this.jumpSound = new Audio("audio/jump.mp3");
    this.runSound = new Audio("audio/run.mp3");

    this.collectedBottles = 5;

  
    this.jumpSound.volume = 0.4;
    this.runSound.volume = 0.4;
  
    this.applyGravity();
    this.animate();
  }
  

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false; // Set the direction to right
        if (!this.isAboveGround()) this.runSound.play();
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true; // Set the direction to left
        if (!this.isAboveGround()) this.runSound.play();
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump(); // Jump if not above ground
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();

      }
      this.world.camera_x = -this.x + 100; // Move the camera to the left
    }, 1000 / 60); // 60 FPS

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 50);
    
  }

  update() {
    this.previousY = this.y;
    this.move();
    this.applyGravity();
  }
  



}
