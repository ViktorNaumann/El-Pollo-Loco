class Chicken extends MovableObject {
    height = 40;
    width = 40;
    y = 390;
    IMAGES_CHICKEN = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_CHICKEN); // Load the images

        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.2; // Random speed between 0.2 and 0.7

        this.animate();
    }

    animate() {
        this.moveLeft(); // Move the chicken to the left
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_CHICKEN.length; // Loop through the images
            let path = this.IMAGES_CHICKEN[i];
            this.img = this.imageCache[path]; // Cache the image
            this.currentImage++;
        }, 150);
    }

}