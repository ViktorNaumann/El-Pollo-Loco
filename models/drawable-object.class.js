class DrawableObject {
  x = 80;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  constructor() {
    this.offset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  }


  // loadImage('img/test.png);
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    
    // Entferne oder kommentiere den folgenden Code-Block aus
    /*
    if (this instanceof Character || this instanceof Chicken || this instanceof CollectableCoin || 
        this instanceof CollectableBottle || this instanceof ThrowableObject || this instanceof Endboss) {
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";
        ctx.rect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        ctx.stroke();
    }
    */
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  drawFrame(ctx) {
    // Entferne oder kommentiere den gesamten Code-Block aus
    /*
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left, 
        this.y + this.offset.top, 
        this.width - this.offset.left - this.offset.right, 
        this.height - this.offset.top - this.offset.bottom
      );
    }
    */
  }
}
