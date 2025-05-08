class Chicken extends MovableObject {
    y = 390;
    offset = { top: 5, left: 5, right: 5, bottom: 5 };

    IMAGES_SMALL_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',  
    ];
    IMAGES_BIG_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];

    IMAGES_SMALL = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_BIG = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor(isBig = false, x = 200 + Math.random() * 3300) {
        super();

        this.x = x;
        this.speed = 0.15 + Math.random() * 0.2;

        if (isBig) {
            this.height = 80;
            this.width = 80;
            this.y = 390 - (this.height - 40);
            this.loadImage(this.IMAGES_BIG[0]);
            this.loadImages(this.IMAGES_BIG);
            this.animationSet = this.IMAGES_BIG;
        } else {
            this.height = 40;
            this.width = 40;
            this.y = 390;
            this.loadImage(this.IMAGES_SMALL[0]);
            this.loadImages(this.IMAGES_SMALL);
            this.animationSet = this.IMAGES_SMALL;
        }

        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.animationSet);
        }, 150);
    }

    die() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
        this.speed = 0;

        if (this.height > 40) {
            this.loadImage(this.IMAGES_BIG_DEAD[0]);
        } else {
            this.loadImage(this.IMAGES_SMALL_DEAD[0]);
        }
        this.loadImage(this.IMAGES_DEAD[0]);
        this.isDead = true;
    }
}

