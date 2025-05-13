/**
 * BackgroundObject class
 * Represents a background object in the game world, such as landscapes, mountains,
 * or decorative elements like signs.
 * @extends DrawableObject
 */
class BackgroundObject extends DrawableObject {
    /**
     * Creates a new background object.
     * @param {string} imagePath - The path to the image that will be used for this background object
     * @param {number} x - The x-coordinate position of the background object
     * @param {number} [y=0] - The y-coordinate position of the background object (default: 0)
     */
    constructor(imagePath, x, y = 0) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 720;
        this.height = 480;

        if (imagePath.includes('sign_transparent.png')) {
            this.width = 100;
            this.height = 100;
            this.y = 310; 
        }
    }
}