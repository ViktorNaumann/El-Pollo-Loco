class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    tumbleweeds;
    level_end_x = 3595;  // End position of the level

    constructor(enemies, clouds, backgroundObjects, coins, bottles, tumbleweeds) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.tumbleweeds = tumbleweeds;
    }
}