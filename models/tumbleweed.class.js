/**
 * Tumbleweed class
 * Represents rolling tumbleweed objects for desert atmosphere
 * @extends MovableObject
 */
class Tumbleweed extends MovableObject {
    width = 60;
    height = 60;
    rotation = 0;
    imageLoaded = false;
    rotationSpeed;

    /**
     * Creates a new tumbleweed at specified position
     * @param {number} x - The x-coordinate position
     * @param {number} y - The y-coordinate position
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.speed = -(Math.random() * 2.5 + 1.5);
        this.rotationSpeed = -(Math.random() * 5 + 3);
        
        const scale = Math.random() * 0.4 + 0.8;
        this.width *= scale;
        this.height *= scale;
        
        this.loadImage('img/desert_background/Steppenhexe.png').then(() => {
            this.imageLoaded = true;
        });
        this.animate();
    }

    /**
     * Loads an image and returns a promise that resolves when loaded
     * @param {string} path - Path to the image file
     * @returns {Promise} Promise that resolves when image is loaded
     */
    loadImage(path) {
        return new Promise((resolve) => {
            this.img = new Image();
            this.img.onload = () => {
                resolve();
            };
            this.img.src = path;
        });
    }

    /**
     * Sets up animation for the tumbleweed
     * Controls movement, rotation and respawning when offscreen
     */
    animate() {
        setInterval(() => {
            this.x += this.speed;
            this.rotation += this.rotationSpeed;
            
            if (this.x < -100) {
                this.x = 3600 + Math.random() * 500;
                this.speed = -(Math.random() * 2.5 + 1.5);
                this.rotationSpeed = -(Math.random() * 5 + 3);
            }
        }, 1000 / 60);
    }

    /**
     * Custom drawing method to handle rotation
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (!this.img || !this.imageLoaded) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}
