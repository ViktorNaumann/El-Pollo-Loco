class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 150;
    IMAGES_ENDBOSS = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',

    ];

    constructor() {
        super().loadImage(this.IMAGES_ENDBOSS[0]); // Load the first image
        this.loadImages(this.IMAGES_ENDBOSS); // Load the images

        this.x = 3900; // Set the initial x position
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ENDBOSS); // Play the chicken animation
        }, 150);
    }
}