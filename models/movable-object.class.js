class MovableObject {
    x = 80;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.1; // Speed of the object
    otherDirection = false; // Direction of the object

    // loadImage('img/test.png);
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    moveRight() {
        console.log('Moving Right');
        
    }

    moveLeft() {
        setInterval(() => {
          this.x -= this.speed; // Move left by speed
        }, 1000 / 60); // 60 FPS
      }
}