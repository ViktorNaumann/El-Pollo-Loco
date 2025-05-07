let chickens = [];
for (let i = 0; i < 12; i++) {
    const isBig = Math.random() < 0.4; // ca. 40% große Chickens
    chickens.push(new Chicken(isBig));
}

let bottles = [];
for (let i = 0; i < 10; i++) {
    let x = 400 + Math.random() * 3000;
    bottles.push(new CollectableBottle(x));
}

let coins = [];
for (let i = 0; i < 5; i++) {
    let x = 400 + i * 500;
    let y = 300;
    coins.push(new CollectableCoin(x, y));
}

const level1 = new Level(
  [
    ...chickens,
    new Endboss()
  ],
  
  [
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
  ],
  [
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
  ],
  bottles
);
  