class CollectableCoin extends MovableObject {
    IMAGES = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
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
