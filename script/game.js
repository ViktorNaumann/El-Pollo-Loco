let canvas;
let world;
let keyboard = new Keyboard(); // Create a new instance of the Keyboard class
let backgroundMusic = new Audio('audio/background1.mp3');
let windSound = new Audio('audio/background2.mp3');
let musicStarted = false; // Flag to check if music has started
let isMuted = false; // Neue Variable für Mute-Status
let gameStarted = false;

backgroundMusic.loop = true;
windSound.loop = true;

backgroundMusic.volume  = 0.4;
windSound.volume = 0.3;




// In der game.js oder einem globalen Bereich
// In game.js - verbesserte restartGame Funktion
function restartGame() {
    console.log("Restarting game..."); // Debug-Log
    
    // Overlay verstecken
    document.getElementById('game-overlay').classList.add('hidden');
    
    // Alte Animationen und Intervalle stoppen
    if (world) {
        // RequestAnimationFrame stoppen (falls möglich)
        window.cancelAnimationFrame(world.animationFrame);
        
        // Eventuelle Intervalle stoppen
        clearAllIntervals();
    }
    
    // Keyboard zurücksetzen
    keyboard = new Keyboard(); // Neues Keyboard-Objekt erstellen
    
    // Spiel neu initialisieren (direkt mit startGame)
    startGame();
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
    
    // Event-Listener für Restart-Button (direkt und unabhängig von keyboard)
    const restartButton = document.querySelector('.restart-button');
    if (restartButton) {
        // Alten Event-Listener entfernen falls vorhanden
        restartButton.removeEventListener('click', restartGame);
        // Neuen Event-Listener hinzufügen
        restartButton.addEventListener('click', restartGame);
    }
    
    // Event-Listener für Zurück-Button hinzufügen
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.removeEventListener('click', backToStartScreen);
        backButton.addEventListener('click', backToStartScreen);
    }
    
    // Rest der Initialisierung...
    
    // Spiel starten mit Startbildschirm wenn vorhanden
    if (document.getElementById('start-screen')) {
        const startButton = document.getElementById('start-button');
        const startScreen = document.getElementById('start-screen');
        
        startButton.addEventListener('click', () => {
            startScreen.style.display = 'none';
            startGame();
        });
    } else {
        // Direktstart ohne Startbildschirm
        startGame();
    }
}

function startGame() {
    gameStarted = true;
    
    // Spiel initialisieren
    let level = initLevel();
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

/**
 * Wechselt zurück zum Start-Screen
 */
function backToStartScreen() {
    console.log("Zurück zum Start-Screen..."); // Debug-Log
    
    // Alte Animationen und Intervalle stoppen
    if (world) {
        window.cancelAnimationFrame(world.animationFrame);
        clearAllIntervals();
    }
    
    // Game-Overlay ausblenden
    document.getElementById('game-overlay').classList.add('hidden');
    
    // Canvas zurücksetzen
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielstatus zurücksetzen
    gameStarted = false;
    
    // Start-Screen einblenden
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.remove('hidden');
    startScreen.style.display = 'flex'; // Explizites Display setzen
    
    // Musik zurücksetzen
    backgroundMusic.currentTime = 0;
    backgroundMusic.pause();
    
    windSound.currentTime = 0;
    windSound.pause();
    
    if (window.endbossMusic) {
        window.endbossMusic.currentTime = 0;
        window.endbossMusic.pause();
    }
    
    musicStarted = false;
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