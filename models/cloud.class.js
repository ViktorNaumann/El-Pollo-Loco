/**
 * Cloud class
 * Represents moving clouds in the game background that add atmosphere
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  width = 450;
  height = 250;

  /**
   * Creates a new cloud at specified x position
   * @param {number} x - The starting x-coordinate position
   */
  constructor(x) {
    const images = [
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png"
    ];
    super();
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    this.loadImage(selectedImage);
  
    this.x = x;
    this.y = 20 + Math.random() * 50;
    this.width = 450;
    this.height = 250;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Sets up cloud animation and movement
   * Clouds move continuously from right to left and reset position when off-screen
   */
  animate() {
    const move = () => {
      this.moveLeft();
      if (this.x < -this.width) {
        this.x = 3900 + Math.random() * 200;
        this.y = 20 + Math.random() * 50;
      }
      requestAnimationFrame(move);
    };
    move();
  }
}