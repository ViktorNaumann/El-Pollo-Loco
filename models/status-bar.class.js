class StatusBar extends DrawableObject {

    IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ];

    percentage = 100; // Percentage of health

    constructor(type = "character") {
        super();
      
        if (type === "endboss") {
          this.IMAGES_HEALTH = [
            'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
          ];
          this.x = 370;
          this.y = 20;
          this.width = 250;
          this.height = 60;
        } else {
          this.IMAGES_HEALTH = [
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
          ];
          this.x = 20;
          this.y = 20;
          this.width = 200;
          this.height = 60;
        }
      
        this.visible = false;
        this.loadImages(this.IMAGES_HEALTH);
        this.setPercentage(100);
      }
      

   setPercentage(percentage) {
        this.percentage = percentage; // Set the health percentage
       let path = this.resolveImagePath(); // Get the image path based on the percentage
        this.img = this.imageCache[path]; // Set the image to the corresponding health image
    }

    resolveImagePath() {
        if (this.percentage == 100) {
            return this.IMAGES_HEALTH[5]; // Return the full health image
        } else if (this.percentage >= 80) {
            return this.IMAGES_HEALTH[4]; // Return the 80% health image
        } else if (this.percentage >= 60) {
            return this.IMAGES_HEALTH[3]; // Return the 60% health image
        } else if (this.percentage >= 40) {
            return this.IMAGES_HEALTH[2]; // Return the 40% health image
        } else if (this.percentage >= 20) {
            return this.IMAGES_HEALTH[1]; // Return the 20% health image
        } else {
            return this.IMAGES_HEALTH[0]; // Return the empty health image
        }
    }
}