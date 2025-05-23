/**
 * StatusBar class
 * Represents different types of status bars in the game (health, bottles, coins)
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  IMAGES_HEALTH = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];
  percentage = 100;
  /**
   * Creates a new status bar of the specified type
   * @param {string} [type="character"] - Type of status bar: "character", "endboss", "bottle", or "coin"
   */
  constructor(type = "character") {
    super();
    if(type === "endboss") {
      this.IMAGES_HEALTH = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
      ];
      this.x = 470;
      this.y = 10;
      this.width = 200;
      this.height = 40;
    } else if(type === "bottle") {
      this.IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ];
      this.x = 20;
      this.y = 50;
      this.width = 150;
      this.height = 40;
    } else if(type === "coin") {
      this.IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png"
      ];
      this.x = 20;
      this.y = 90;
      this.width = 150;
      this.height = 40;
    } else {
      this.IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ];
      this.x = 20;
      this.y = 10;
      this.width = 150;
      this.height = 40;
    }
    this.visible = false; 
    this.loadImages(this.IMAGES_HEALTH);
    this.setPercentage(100);
  }
  /**
   * Updates the status bar to show the specified percentage
   * @param {number} percentage - Value between 0-100 representing the status level
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.resolveImagePath();
    this.img = this.imageCache[path];
  }
  /**
   * Determines which image to display based on the current percentage
   * @returns {string} Path to the appropriate status bar image
   */
  resolveImagePath() {
    if(this.percentage == 100) {
      return this.IMAGES_HEALTH[5];
    } else if(this.percentage >= 80) {
      return this.IMAGES_HEALTH[4];
    } else if(this.percentage >= 60) {
      return this.IMAGES_HEALTH[3];
    } else if(this.percentage >= 40) {
      return this.IMAGES_HEALTH[2];
    } else if(this.percentage >= 20) {
      return this.IMAGES_HEALTH[1];
    } else {
      return this.IMAGES_HEALTH[0];
    }
  }
}
