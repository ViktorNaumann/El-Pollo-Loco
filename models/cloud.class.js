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
    this.y = 20 + Math.random() * 50; // Zufällige Höhe für Variation
    this.width = 450;
    this.height = 250;
    this.speed = 0.15 + Math.random() * 0.25; // Etwas schneller: 0.15-0.4
    this.animate();
  }

  animate() {
    const move = () => {
      this.moveLeft();
      // Wenn Wolke links aus dem Bild ist
      if (this.x < -this.width) {
        // Zurück ans Ende des Levels + zufälliger Abstand
        this.x = 3900 + Math.random() * 200;
        // Neue zufällige Höhe
        this.y = 20 + Math.random() * 50;
      }
      requestAnimationFrame(move);
    };
    move();
  }
}
