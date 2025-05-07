class BackgroundObject extends DrawableObject {
    constructor(imagePath, x, y = 0) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;

        // Standard-Größe für Hintergründe
        this.width = 720;
        this.height = 480;

        // Spezielle Größe und Position für Schilder
        if (imagePath.includes('sign_transparent.png')) {
            this.width = 100;    // Breite des Schildes
            this.height = 100;   // Höhe des Schildes
            this.y = 310;        // Position angepasst auf Chicken-Höhe
        }
    }
}