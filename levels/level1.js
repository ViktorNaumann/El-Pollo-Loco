/**
 * Creates collectible coins for the level
 * Generates 20 coins at random positions across the playable area
 * @returns {Array<CollectableCoin>} Array of coin objects
 */
function createCoins(){
    let coins=[];
    for(let i=0;i<20;i++){
        let x=400+Math.random()*3000;
        let y=100+Math.random()*200;
        coins.push(new CollectableCoin(x,y));
    }
    return coins;
}

/**
 * Creates enemy characters for the level
 * Generates 10 random chickens and the endboss
 * @returns {Array<MovableObject>} Array of enemy objects
 */
function createLevelEnemies(){
    let chickens=[];
    for(let i=0;i<10;i++){
        const isBig=Math.random()<0.4;
        const x=500+Math.random()*2500;
        const chicken=new Chicken(isBig);
        chicken.x=x;
        chickens.push(chicken);
    }
    return[
        ...chickens,
        new Endboss()
    ];
}

/**
 * Creates cloud objects for the background
 * Generates 12 clouds with regular spacing across the level
 * @returns {Array<Cloud>} Array of cloud objects
 */
function createClouds(){
    let clouds=[];
    for(let i=0;i<12;i++){
        clouds.push(new Cloud(i*400));
    }
    return clouds;
}

/**
 * Creates background objects for the level environment
 * Includes layered parallax backgrounds and decorative signs
 * @returns {Array<BackgroundObject>} Array of background objects
 */
function createBackgrounds(){
    return[
        new BackgroundObject("img/5_background/layers/air.png",-719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png",-719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png",-719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png",-719),
        new BackgroundObject("img/5_background/layers/air.png",0),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png",0),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png",0),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png",0),
        new BackgroundObject("img/5_background/layers/air.png",719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png",719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png",719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png",719),
        new BackgroundObject("img/5_background/layers/air.png",1438),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png",1438),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png",1438),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png",1438),
        new BackgroundObject("img/5_background/layers/air.png",2157),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png",2157),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png",2157),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png",2157),
        new BackgroundObject("img/5_background/layers/air.png",2876),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png",2876),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png",2876),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png",2876),
        new BackgroundObject("img/5_background/layers/air.png",3595),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png",3595),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png",3595),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png",3595),
        new BackgroundObject("img/desert_background/start_sign_transparent.png",300,350),
        new BackgroundObject("img/desert_background/ende_sign_transparent.png",3400,350)
    ];
}

/**
 * Creates collectible bottle objects
 * Generates 10 bottles at random positions across the level
 * @returns {Array<CollectableBottle>} Array of bottle objects
 */
function createBottles(){
    let bottles=[];
    for(let i=0;i<10;i++){
        let x=400+Math.random()*3000;
        bottles.push(new CollectableBottle(x));
    }
    return bottles;
}

/**
 * Creates tumbleweed objects for desert atmosphere
 * Generates tumbleweeds across the level and beyond the endboss
 * @returns {Array<Tumbleweed>} Array of tumbleweed objects
 */
function createTumbleweeds(){
    const tumbleweeds=[];
    for(let i=0;i<2;i++){
        const x=500+Math.random()*2900;
        const y=380;
        tumbleweeds.push(new Tumbleweed(x,y));
    }
    for(let i=0;i<3;i++){
        const x=3800+Math.random()*1500;
        const y=380;
        tumbleweeds.push(new Tumbleweed(x,y));
    }
    return tumbleweeds;
}

/**
 * Level 1 configuration
 * Main level object with all game elements
 */
const level1=new Level(
    createLevelEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles(),
    createTumbleweeds()
);
