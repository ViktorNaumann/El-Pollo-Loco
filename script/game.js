let canvas;
let world;
let keyboard = new Keyboard(); // Create a new instance of the Keyboard class
let backgroundMusic = new Audio('audio/background1.mp3');
let windSound = new Audio('audio/background2.mp3');
let musicStarted = false; // Flag to check if music has started
let isMuted = false; // Neue Variable für Mute-Status

backgroundMusic.loop = true;
windSound.loop = true;

backgroundMusic.volume  = 0.4;
windSound.volume = 0.3;




// In der game.js oder einem globalen Bereich
function restartGame() {
    // Overlay verstecken
    document.getElementById('game-overlay').classList.add('hidden');
    
    // Alte Animationen und Intervalle stoppen
    if (world) {
        // RequestAnimationFrame stoppen (falls möglich)
        window.cancelAnimationFrame(world.animationFrame);
        
        // Eventuelle Intervalle stoppen
        clearAllIntervals();
    }
    
    // Spiel neu initialisieren
    init();
}

// Hilfsfunktion zum Stoppen aller Intervalle
function clearAllIntervals() {
    // Höchste bekannte Intervall-ID ermitteln
    var highestIntervalId = window.setInterval(function(){}, 0);
    
    // Alle Intervalle stoppen
    for (var i = 1; i <= highestIntervalId; i++) {
        window.clearInterval(i);
    }
}

// Level-Initialisierung
function initLevel() {
  // Neues Level erstellen
  let level = new Level(
    createLevelEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles(),
    createTumbleweeds()
  );
  
  // Level in der globalen Variable speichern, damit die World darauf zugreifen kann
  window.level = level;
  
  // Game-State zurücksetzen
  musicStarted = false;
  
  return level; // Level zurückgeben für sofortige Verwendung
}

function init() {
    canvas = document.getElementById('canvas');
    
    // Level vor der World-Erstellung initialisieren
    let level = initLevel();
    
    // Neue World mit dem initialisierten Level erstellen
    world = new World(canvas, keyboard, level);
    
    // Character-Status zurücksetzen
    world.character.energy = 100;
    world.character.collectedBottles = 0;
    world.collectedCoins = 0;
    
    // Statusbars aktualisieren
    world.statusBar.setPercentage(100);
    world.statusBarBottle.setPercentage(0);
    world.statusBarCoin.setPercentage(0);
    
    // Musik zurücksetzen und starten
    backgroundMusic.currentTime = 0;
    windSound.currentTime = 0;
    backgroundMusic.play();
    windSound.play();
    musicStarted = true;
    
    // Tastatureingaben aktivieren
    keyboard.enabled = true;
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