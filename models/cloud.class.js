class Cloud extends MovableObject {
  y = 20;
  width = 450;
  height = 250;

  constructor(x) {
    const images = [
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png"
    ];
    super();
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    this.loadImage(selectedImage);
  
    this.x = x;
    this.y = 20;
    this.width = 450;
    this.height = 250;
    this.speed = 0.05 + Math.random() * 0.25; // ergibt 0.05–0.3
    this.animate();
  }
  

  animate() {
    const move = () => {
      this.moveLeft();
      requestAnimationFrame(move);
    };
    move();
  }
  
  
}
