function createCoins() {
    let coins = [];
    
    // 20 Münzen zufällig über das Spielfeld verteilen
    for (let i = 0; i < 20; i++) {
        // x-Position: Zwischen 400 und 3400 (gesamte Spielfeldbreite)
        let x = 400 + Math.random() * 3000;
        // y-Position: Zwischen 100 und 300 (spielbare Höhe)
        let y = 100 + Math.random() * 200;
        
        coins.push(new CollectableCoin(x, y));
    }

    return coins;
}

function createLevelEnemies() {
    let chickens = [];
    for (let i = 0; i < 12; i++) {
        const isBig = Math.random() < 0.4; // ca. 40% große Chickens
        chickens.push(new Chicken(isBig));
    }
    return [
        ...chickens,
        new Endboss()
    ];
}

function createClouds() {
    return [
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595),
        new Cloud(Math.random() * 3595)
    ];
}

function createBackgrounds() {
    return [
        new BackgroundObject("img/5_background/layers/air.png", -719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

        new BackgroundObject("img/5_background/layers/air.png", 0),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/air.png", 719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

        new BackgroundObject("img/5_background/layers/air.png", 1438),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1438),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 1438),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1438),
        new BackgroundObject("img/5_background/layers/air.png", 2157),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2157),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 2157),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2157),

        new BackgroundObject("img/5_background/layers/air.png", 2876),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 2876),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 2876),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 2876),
        new BackgroundObject("img/5_background/layers/air.png", 3595),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 3595),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 3595), 
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 3595),

        // Start-Schild (am Anfang des Levels)
        new BackgroundObject("img/desert_background/start_sign_transparent.png", 300, 350), // y-Position angepasst für Boden

        // End-Schild (beim Endboss, ca. bei x=3400)
        new BackgroundObject("img/desert_background/ende_sign_transparent.png", 3400, 350)
    ];
}

function createBottles() {
    let bottles = [];
    for (let i = 0; i < 10; i++) {
        let x = 400 + Math.random() * 3000;
        bottles.push(new CollectableBottle(x));
    }
    return bottles;
}

const level1 = new Level(
    createLevelEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles()
);
