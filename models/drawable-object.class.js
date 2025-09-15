/**
 * DrawableObject class
 * Base class for all visible game objects that can be drawn on the canvas
 */
class DrawableObject {
  x = 80;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  /**
   * Initializes a new drawable object with default offset values
   */
  constructor() {
    this.offset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  }

  /**
   * Loads a single image from the given path
   * Uses preloaded image if available, otherwise loads directly
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    if (window.assetLoader && window.assetLoader.getImage(path)) {
      this.img = window.assetLoader.getImage(path);
    } else {
      this.img = new Image();
      this.img.src = path;
    }
  }

  /**
   * Draws the object on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads multiple images into the image cache for animations
   * Uses preloaded images if available, otherwise loads directly
   * @param {Array<string>} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      if (window.assetLoader && window.assetLoader.getImage(path)) {
        this.imageCache[path] = window.assetLoader.getImage(path);
      } else {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      }
    });
  }

  /**
   * For collision detection visualization (empty implementation)
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  drawFrame(ctx) {
  }
}
