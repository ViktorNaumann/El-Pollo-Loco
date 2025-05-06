class CollectableBottle extends MovableObject {
    constructor(x) {
        super();
        const images = [
            "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
            "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
        ];
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        this.loadImage(selectedImage);
        this.x = x;
        this.y = 360; // am Boden
        this.height = 70;
        this.width = 50;
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
    }
}