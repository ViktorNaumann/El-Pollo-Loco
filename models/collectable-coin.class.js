class CollectableCoin extends MovableObject {
    IMAGES = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];
    height = 100; // Verdoppelt von 40 auf 80
    width = 100;  // Verdoppelt von 40 auf 80

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}
