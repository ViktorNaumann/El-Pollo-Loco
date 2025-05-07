class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottle;
    level_end_x = 3595;  // End position of the level

    constructor(enemies, clouds, backgroundObjects) { // mman könnte auch hier x, y und z übergeben
        this.enemies = enemies; // dan wurde hier es so stehen hier: this.enemies = x;
        this.clouds = clouds; // und hier: this.clouds = y;
        this.backgroundObjects = backgroundObjects; // und hier: this.backgroundObjects = z;
        this.bottles = bottles;
        this.coins = coins; // ✅ Coins speichern
    }
}