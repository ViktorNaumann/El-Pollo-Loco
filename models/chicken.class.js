class Chicken extends MovableObject {

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.x = 250 + Math.random() * 500;
    }

}