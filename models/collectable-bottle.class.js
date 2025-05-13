/**
 * CollectableBottle class
 * Represents collectable salsa bottles that can be picked up by the player
 * @extends MovableObject
 */
class CollectableBottle extends MovableObject {
    
    /**
     * Creates a new collectable bottle at specified x position
     * @param {number} x - The x-coordinate position of the bottle
     */
    constructor(x) {
        super();
        const images = [
            "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
            "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
        ];
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        this.loadImage(selectedImage);
        this.x = x;
        this.y = 360;
        this.height = 70;
        this.width = 50;
        this.offset = { top: 5, left: 5, right: 5, bottom: 5 };
    }
}