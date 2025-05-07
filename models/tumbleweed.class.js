class Tumbleweed extends MovableObject {
    width = 60;
    height = 60;
    rotation = 0;
    imageLoaded = false;
    rotationSpeed;

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        // Negative Geschwindigkeit für Bewegung von rechts nach links
        this.speed = -(Math.random() * 2.5 + 1.5);
        // Negative Rotationsgeschwindigkeit für Drehung gegen den Uhrzeigersinn
        this.rotationSpeed = -(Math.random() * 5 + 3);
        // Zufällige Größenvariation (80% bis 120% der Originalgröße)
        const scale = Math.random() * 0.4 + 0.8;
        this.width *= scale;
        this.height *= scale;
        
        this.loadImage('img/desert_background/Steppenhexe.png').then(() => {
            this.imageLoaded = true;
        });
        this.animate();
    }

    loadImage(path) {
        return new Promise((resolve) => {
            this.img = new Image();
            this.img.onload = () => {
                resolve();
            };
            this.img.src = path;
        });
    }

    animate() {
        setInterval(() => {
            this.x += this.speed;
            this.rotation += this.rotationSpeed;
            
            // Wenn außerhalb des Bildschirms links, dann rechts neu positionieren
            if (this.x < -100) {
                this.x = 3600 + Math.random() * 500; // Zufällige Startposition rechts
                // Neue zufällige negative Geschwindigkeit
                this.speed = -(Math.random() * 2.5 + 1.5);
                // Neue zufällige negative Rotationsgeschwindigkeit
                this.rotationSpeed = -(Math.random() * 5 + 3);
            }
        }, 1000 / 60);
    }

    draw(ctx) {
        if (!this.img || !this.imageLoaded) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}