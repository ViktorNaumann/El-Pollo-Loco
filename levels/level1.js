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
    for (let i = 0; i < 30; i++) {
        const isBig = Math.random() < 0.4; // ca. 40% große Chickens
        // Startposition nach dem Schild (x > 500) und zufällig über das restliche Level verteilt
        const x = 500 + Math.random() * 2500; // Zufällige Position zwischen x=500 und x=3000
        const chicken = new Chicken(isBig);
        chicken.x = x; // Überschreibe die Standard-X-Position
        chickens.push(chicken);
    }
    return [
        ...chickens,
        new Endboss()
    ];
}

function createClouds() {
    let clouds = [];
    // Mehr Wolken mit geringerem Abstand
    for (let i = 0; i < 12; i++) { // Erhöht von 8 auf 12 Wolken
        clouds.push(new Cloud(i * 400)); // Reduzierter Abstand zwischen Wolken
    }
    return clouds;
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

function createTumbleweeds() {
    const tumbleweeds = [];
    // Erstelle 3 Steppenhexen, die bereits auf dem Spielfeld sind
    for (let i = 0; i < 3; i++) {
        const x = 500 + Math.random() * 2900; // Zufällige Position zwischen Start und Endboss
        const y = 380;
        tumbleweeds.push(new Tumbleweed(x, y));
    }
    
    // Erstelle 5 Steppenhexen hinter dem Endboss
    for (let i = 0; i < 5; i++) {
        const x = 3800 + Math.random() * 1500; // Startposition hinter dem Endboss (3400)
        const y = 380;
        tumbleweeds.push(new Tumbleweed(x, y));
    }
    return tumbleweeds;
}

const level1 = new Level(
    createLevelEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles(),
    createTumbleweeds() // Neue Zeile
);
