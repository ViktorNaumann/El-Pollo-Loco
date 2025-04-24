class MovableObject {
    x = 80;
    y = 300;
    img;
    height = 150;
    width = 100;

    // loadImage('img/test.png);
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }


    moveRight() {
        console.log('Moving Right');
        
    }

    moveLeft() {
        console.log('Moving Left');
        
    }
}