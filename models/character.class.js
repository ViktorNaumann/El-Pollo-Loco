class Character extends MovableObject {
    height = 250;
    width = 130;
    x = 100;
    y = 185;

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];



    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        super.loadImages(this.IMAGES_IDLE);

        this.animate();
    }

   animate() {
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_IDLE.length; // Loop through the images
            let path = this.IMAGES_IDLE[i];
            this.img = this.imageCache[path]; // Cache the image
            this.currentImage++;
        }, 150);
    }




    jump() {

    }
}