let canvas;
let world;
let keyboard = new Keyboard(); // Create a new instance of the Keyboard class
let backgroundMusic = new Audio('audio/background1.mp3');
let windSound = new Audio('audio/background2.mp3');
let musicStarted = false; // Flag to check if music has started

backgroundMusic.loop = true;
windSound.loop = true;

backgroundMusic.volume  = 0.4;
windSound.volume = 0.3;




function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);  
}

window.addEventListener("keydown", (event) => {
    if (!musicStarted) {
        backgroundMusic.play();
        windSound.play();
        musicStarted = true;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (event.keyCode == 38) {
        keyboard.UP = true;
    }
    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (event.keyCode == 68) {
        keyboard.D = true;
    }
    console.log(event);
}
);

window.addEventListener("keyup", (event) => {
    if (event.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (event.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (event.keyCode == 38) {
        keyboard.UP = false;
    }
    if (event.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (event.keyCode == 68) {
        keyboard.D = false;
    }
    console.log(event);
}
);