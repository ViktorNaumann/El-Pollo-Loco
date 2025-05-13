/**
 * Level class
 * Represents a complete game level containing all game objects
 */
class Level {
    /**
     * Array of enemy objects in the level
     * @type {Array}
     */
    enemies;
    
    /**
     * Array of cloud objects for background effects
     * @type {Array}
     */
    clouds;
    
    /**
     * Array of background objects like mountains and landscapes
     * @type {Array}
     */
    backgroundObjects;
    
    /**
     * Array of collectable coins
     * @type {Array}
     */
    coins;
    
    /**
     * Array of collectable bottles
     * @type {Array}
     */
    bottles;
    
    /**
     * Array of tumbleweed objects for atmosphere
     * @type {Array}
     */
    tumbleweeds;
    
    /**
     * X-coordinate defining the end of the level
     * @type {number}
     */
    level_end_x = 3595;

    /**
     * Creates a new game level with all required objects
     * @param {Array} enemies - All enemies in the level
     * @param {Array} clouds - Background cloud objects
     * @param {Array} backgroundObjects - Landscape elements
     * @param {Array} coins - Collectable coins
     * @param {Array} bottles - Collectable bottles
     * @param {Array} tumbleweeds - Decorative tumbleweed objects
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, tumbleweeds) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.tumbleweeds = tumbleweeds;
    }
}
