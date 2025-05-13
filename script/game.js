/**
 * Game initialization and control script
 * Manages game state, music, input handling, and UI interactions
 */
let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic = new Audio('audio/background1.mp3');
let windSound = new Audio('audio/background2.mp3');
let musicStarted = false;
window.isMuted = false;
let gameStarted = false;

backgroundMusic.loop = true;
windSound.loop = true;
backgroundMusic.volume = 0.4;
windSound.volume = 0.3;

/**
 * Restarts the game from the beginning
 * Resets all game elements and starts a new game session
 */
function restartGame() {
    document.getElementById('game-overlay').classList.add('hidden');
    if (world) {
        window.cancelAnimationFrame(world.animationFrame);
        clearAllIntervals();
    }
    keyboard = new Keyboard();
    startGame();
}

/**
 * Clears all active interval timers
 * Prevents memory leaks when restarting or ending the game
 */
function clearAllIntervals() {
    var highestIntervalId = window.setInterval(function(){}, 0);
    for (var i = 1; i <= highestIntervalId; i++) {
        window.clearInterval(i);
    }
}

/**
 * Initializes a new game level with all required elements
 * @returns {Level} The initialized level object
 */
function initLevel() {
    let level = new Level(
        createLevelEnemies(),
        createClouds(),
        createBackgrounds(),
        createCoins(),
        createBottles(),
        createTumbleweeds()
    );
    window.level = level;
    musicStarted = false;
    return level;
}

/**
 * Main initialization function
 * Sets up event listeners and prepares the game environment
 */
function init() {
    canvas = document.getElementById('canvas');
    const restartButton = document.querySelector('.restart-button');
    if (restartButton) {
        restartButton.removeEventListener('click', restartGame);
        restartButton.addEventListener('click', restartGame);
    }
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.removeEventListener('click', backToStartScreen);
        backButton.addEventListener('click', backToStartScreen);
    }
    if (document.getElementById('start-screen')) {
        const startButton = document.getElementById('start-button');
        const startScreen = document.getElementById('start-screen');
        startButton.addEventListener('click', () => {
            startScreen.style.display = 'none';
            startGame();
        });
    } else {
        startGame();
    }
}

/**
 * Starts the game
 * Initializes level, world, character stats and music
 */
function startGame() {
    gameStarted = true;
    let level = initLevel();
    world = new World(canvas, keyboard, level);
    world.character.energy = 100;
    world.character.collectedBottles = 0;
    world.collectedCoins = 0;
    world.statusBar.setPercentage(100);
    world.statusBarBottle.setPercentage(0);
    world.statusBarCoin.setPercentage(0);
    backgroundMusic.currentTime = 0;
    windSound.currentTime = 0;
    if (!window.isMuted) {
        backgroundMusic.play();
        windSound.play();
        backgroundMusic.volume = 0.4;
        windSound.volume = 0.3;
    } else {
        backgroundMusic.volume = 0;
        windSound.volume = 0;
        backgroundMusic.play();
        windSound.play();
    }
    musicStarted = true;
    keyboard.enabled = true;
}

/**
 * Returns to the start screen
 * Stops all game processes and resets the game state
 */
function backToStartScreen() {
    if (world) {
        window.cancelAnimationFrame(world.animationFrame);
        clearAllIntervals();
    }
    document.getElementById('game-overlay').classList.add('hidden');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStarted = false;
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.remove('hidden');
    startScreen.style.display = 'flex';
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

/**
 * Toggles sound mute state
 * Updates UI and applies mute state to all audio elements
 */
function toggleMute() {
    window.isMuted = !window.isMuted;
    const muteButton = document.getElementById('mute-button');
    if (window.isMuted) {
        muteButton.textContent = "MUTED";
        muteButton.classList.remove('sound-on');
        muteButton.classList.add('sound-off');
    } else {
        muteButton.textContent = "SOUND";
        muteButton.classList.remove('sound-off');
        muteButton.classList.add('sound-on');
    }
    backgroundMusic.volume = window.isMuted ? 0 : 0.4;
    windSound.volume = window.isMuted ? 0 : 0.3;
    if (world) {
        if (world.endbossFightMusic) {
            world.endbossFightMusic.volume = window.isMuted ? 0 : 0.2;
        }
    }
}

/**
 * Gets the default volume level for a given sound
 * @param {string} soundKey - Identifier for the sound
 * @returns {number} The default volume for the sound
 */
function getDefaultVolume(soundKey) {
    const volumes = {
        'hitSound': 0.3,
        'jumpSound': 0.4,
        'runSound': 0.3,
        'throwSound': 0.3,
        'breakSound': 0.3,
        'collectSound': 0.3,
        'collectCoinSound': 0.3,
        'bossHurtSound': 0.4,
        'squeezeChickenSound': 0.3,
        'winSound': 0.7,
        'lostSound': 0.9,
        'lostSpeakSound': 0.9
    };
    return volumes[soundKey] || 0.3;
}

/**
 * Plays a sound with volume adjustment and mute control
 * @param {HTMLAudioElement} sound - The sound to play
 * @param {number} volume - Volume level from 0 to 1
 */
window.playSound = function(sound, volume = 0.3) {
    if (!sound) return;
    if (!window.isMuted) {
        sound.currentTime = 0;
        sound.volume = volume || getDefaultVolume(sound.id) || 0.3;
        sound.play().catch(error => {});
    }
}

/**
 * Opens the impressum (legal info) modal
 * Pauses background music when opened
 */
function openImpressum() {
    if (backgroundMusic && !window.isMuted && musicStarted) {
        backgroundMusic.pause();
    }
    document.getElementById('impressum-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the impressum modal
 * Resumes background music if appropriate
 */
function closeImpressum() {
    document.getElementById('impressum-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    if (backgroundMusic && !window.isMuted && musicStarted && !gameStarted) {
        backgroundMusic.play();
    }
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
});

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
});

document.addEventListener('DOMContentLoaded', function() {
    const impressumModal = document.getElementById('impressum-modal');
    impressumModal.addEventListener('click', function(event) {
        if (event.target === impressumModal) {
            closeImpressum();
        }
    });
});
