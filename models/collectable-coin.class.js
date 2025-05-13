/**
 * CollectableCoin class
 * Represents collectable coins that can be picked up by the player
 * @extends MovableObject
 */
class CollectableCoin extends MovableObject {
    IMAGES = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];
    height = 100;
    width = 100;

    /**
     * Creates a new collectable coin at the specified position
     * @param {number} x - The x-coordinate position of the coin
     * @param {number} y - The y-coordinate position of the coin
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    /**
     * Sets up coin animation
     * Continuously cycles through coin images to create spinning effect
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}

