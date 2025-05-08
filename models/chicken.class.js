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
        // Zufällige individuelle Eigenschaften für jedes Huhn
        this.speed = 0.15 + Math.random() * 0.25; // Geschwindigkeit zwischen 0.15 und 0.4
        this.otherDirection = Math.random() < 0.5; // Zufällige Startrichtung
        this.changeDirectionTime = Date.now();
        this.minDirectionTime = 3000 + Math.random() * 2000; // 3-5 Sekunden
        this.maxDirectionTime = 5000 + Math.random() * 3000; // 5-8 Sekunden
        this.pauseProbability = 0.005; // 0.5% Chance pro Frame zum Pausieren
        this.pauseDuration = 1000 + Math.random() * 2000; // 1-3 Sekunden Pause
        this.isPaused = false;
        this.lastPauseTime = 0;

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
            // Bewegung und Richtungswechsel
            if (this.otherDirection) {
                this.moveRight();
            } else {
                this.moveLeft();
            }

            // Zufälliger Richtungswechsel mit neuer Geschwindigkeit
            let currentTime = Date.now();
            if (currentTime - this.changeDirectionTime > this.getRandomDirectionTime()) {
                this.otherDirection = Math.random() < 0.6 ? !this.otherDirection : this.otherDirection;
                this.changeDirectionTime = currentTime;
                // Neue zufällige Geschwindigkeit beim Richtungswechsel
                this.speed = 0.15 + Math.random() * 0.25;
            }
        }, 1000 / 60);

        // Animation kontinuierlich abspielen
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.animationSet);
        }, 150);
    }

    getRandomDirectionTime() {
        return Math.random() * (this.maxDirectionTime - this.minDirectionTime) + this.minDirectionTime;
    }

    moveRight() {
        super.moveRight();
        if (this.x > 3500) { // Spielfeldgrenze rechts
            this.otherDirection = false;
            this.changeDirectionTime = Date.now();
        }
    }

    moveLeft() {
        super.moveLeft();
        if (this.x < 0) { // Spielfeldgrenze links
            this.otherDirection = true;
            this.changeDirectionTime = Date.now();
        }
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

