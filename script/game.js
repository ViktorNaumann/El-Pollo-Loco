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
let gameOver = false;
let assetLoader = new AssetLoader();
let assetsLoaded = false;
window.assetLoader = assetLoader;
window.backgroundMusic = backgroundMusic;
window.windSound = windSound;
window.gameOver = false;
backgroundMusic.loop = true;
windSound.loop = true;
backgroundMusic.volume = 0.4;
windSound.volume = 0.3;

/**
 * Restarts the game from the beginning
 * Resets all game elements and starts a new game session
 */
function restartGame() {
    gameOver = false;
    window.gameOver = false;
    document.getElementById('game-overlay').classList.add('hidden');
    if (world) {
        window.cancelAnimationFrame(world.animationFrame);
        clearAllIntervals();
    }
    keyboard = new Keyboard();
    keyboard.bind();
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
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    const gameOverlay = document.getElementById('game-overlay');
    loadingScreen.style.display = 'flex';
    loadingScreen.classList.remove('hidden');
    startScreen.classList.add('hidden');
    gameOverlay.classList.add('hidden');
    loadMuteStateFromStorage();
    setupEventListeners();
    initMobileControls();
    keyboard.bind();
    startAssetLoading();
}

/**
 * Starts the asset loading process with progress tracking
 */
function startAssetLoading() {
    setupLoadingScreenElements();
    setupAssetLoaderCallbacks();
    assetLoader.loadAllAssets();
}

/**
 * Sets up loading screen elements and visibility
 */
function setupLoadingScreenElements() {
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    loadingScreen.style.display = 'flex';
    startScreen.classList.add('hidden');
}

/**
 * Sets up progress and completion callbacks for asset loader
 */
function setupAssetLoaderCallbacks() {
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    assetLoader.setProgressCallback((percentage) => {
        progressBar.style.width = percentage + '%';
        loadingText.textContent = percentage + '%';
    });
    assetLoader.setCompleteCallback(() => {
        assetsLoaded = true;
        showStartScreenAfterLoading();
    });
}

/**
 * Shows start screen after loading is complete
 */
function showStartScreenAfterLoading() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const startScreen = document.getElementById('start-screen');
        loadingScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
        initializeStartScreen();
    }, 500);
}

/**
 * Sets up event listeners for restart and back buttons
 */
function setupEventListeners() {
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
}

/**
 * Initializes the start screen or starts the game directly
 */
function initializeStartScreen() {
    if (document.getElementById('start-screen') && assetsLoaded) {
        setupStartButton();
    } else if (!document.getElementById('start-screen')) {
        startGame();
    }
}

/**
 * Sets up the start button with event listener
 */
function setupStartButton() {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const newStartButton = startButton.cloneNode(true);
    startButton.parentNode.replaceChild(newStartButton, startButton);  
    newStartButton.addEventListener('click', () => {
        if (assetsLoaded) {
            startScreen.style.display = 'none';
            startGame();
        }
    });
}

/**
 * Starts the game
 * Initializes level, world, character stats and music
 */
function startGame() {
    gameStarted = true;
    let level = initLevel();
    world = new World(canvas, keyboard, level);
    initializeGameStats();
    initializeGameMusic();
    keyboard.enabled = true;
}

/**
 * Initializes game statistics and status bars
 */
function initializeGameStats() {
    world.character.energy = 100;
    world.character.collectedBottles = 0;
    world.collectedCoins = 0;
    world.statusBar.setPercentage(100);
    world.statusBarBottle.setPercentage(0);
    world.statusBarCoin.setPercentage(0);
}

/**
 * Initializes and starts background music
 */
function initializeGameMusic() {
    if (window.gameOver) return;
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
}

/**
 * Returns to the start screen
 * Stops all game processes and resets the game state
 */
function backToStartScreen() {
    stopGameProcesses();
    resetCanvas();
    showStartScreen();
    stopAllMusic();
}

/**
 * Stops all running game processes
 */
function stopGameProcesses() {
    if (world) {
        window.cancelAnimationFrame(world.animationFrame);
        clearAllIntervals();
    }
    gameStarted = false;
}

/**
 * Resets the canvas and hides game overlay
 */
function resetCanvas() {
    document.getElementById('game-overlay').classList.add('hidden');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Shows the start screen
 */
function showStartScreen() {
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const gameOverlay = document.getElementById('game-overlay');
    loadingScreen.classList.add('hidden');
    loadingScreen.style.display = 'none';
    gameOverlay.classList.add('hidden');
    startScreen.classList.remove('hidden');
    startScreen.style.display = 'flex';
}

/**
 * Stops all background music and sounds
 */
function stopAllMusic() {
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
 * Loads the mute state from localStorage
 * Sets the initial mute state and updates UI accordingly
 */
function loadMuteStateFromStorage() {
    const savedMuteState = localStorage.getItem('elPolloLocoMuteState');
    if (savedMuteState !== null) {
        window.isMuted = savedMuteState === 'true';
        updateMuteButtonUI();
        updateAudioVolumes();
    }
}

/**
 * Saves the current mute state to localStorage
 */
function saveMuteStateToStorage() {
    localStorage.setItem('elPolloLocoMuteState', window.isMuted.toString());
}

/**
 * Toggles sound mute state
 * Updates UI and applies mute state to all audio elements
 */
function toggleMute() {
    window.isMuted = !window.isMuted;
    updateMuteButtonUI();
    updateAudioVolumes();
    saveMuteStateToStorage();
    document.getElementById('mute-button').blur();
}

/**
 * Updates the mute button UI based on mute state
 */
function updateMuteButtonUI() {
    const muteButton = document.getElementById('mute-button');
    const soundIcon = document.getElementById('sound-icon');
    if (window.isMuted) {
        soundIcon.src = 'img/sound-off.png';
        muteButton.classList.remove('sound-on');
        muteButton.classList.add('sound-off');
    } else {
        soundIcon.src = 'img/sound-on.png';
        muteButton.classList.remove('sound-off');
        muteButton.classList.add('sound-on');
    }
}

/**
 * Updates all audio volumes based on mute state
 */
function updateAudioVolumes() {
    backgroundMusic.volume = window.isMuted ? 0 : 0.4;
    windSound.volume = window.isMuted ? 0 : 0.3;
    if (world && world.endbossFightMusic) {
        world.endbossFightMusic.volume = window.isMuted ? 0 : 0.2;
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
    handleKeyDown(event.keyCode);
});

window.addEventListener("keyup", (event) => {
    handleKeyUp(event.keyCode);
});

/**
 * Handles keydown events for game controls
 * @param {number} keyCode - The key code that was pressed
 */
function handleKeyDown(keyCode) {
    const keyMappings = {
        37: () => keyboard.LEFT = true,
        39: () => keyboard.RIGHT = true,
        38: () => keyboard.UP = true,
        40: () => keyboard.DOWN = true,
        32: () => keyboard.SPACE = true,
        68: () => keyboard.D = true
    };
    if (keyMappings[keyCode]) {
        keyMappings[keyCode]();
    }
}

/**
 * Handles keyup events for game controls
 * @param {number} keyCode - The key code that was released
 */
function handleKeyUp(keyCode) {
    const keyMappings = {
        37: () => keyboard.LEFT = false,
        39: () => keyboard.RIGHT = false,
        38: () => keyboard.UP = false,
        40: () => keyboard.DOWN = false,
        32: () => keyboard.SPACE = false,
        68: () => keyboard.D = false
    };
    if (keyMappings[keyCode]) {
        keyMappings[keyCode]();
    }
}

/**
 * Mobile orientation and controls management
 */
function initMobileControls() {
    checkOrientation();
    loadTouchControlsState();
    window.addEventListener('orientationchange', () => {
        setTimeout(checkOrientation, 100);
    });
    window.addEventListener('resize', checkOrientation);
}

/**
 * Checks device orientation and shows/hides appropriate UI elements
 */
function checkOrientation() {
    const isNarrow = window.innerWidth <= 850;
    const isLandscape = window.innerWidth > window.innerHeight;
    if (isNarrow && !isLandscape) {
        showRotateMessage();
    } else if (isNarrow && isLandscape) {
        updateMobileControlsVisibility();
    } else {
        showDesktopMode();
    }
}

/**
 * Updates mobile controls visibility based on user preference
 */
function updateMobileControlsVisibility() {
    const rotateMessage = document.getElementById('rotate-message');
    const mobileControls = document.getElementById('mobile-controls');
    const canvas = document.getElementById('canvas');
    const toggleButton = document.getElementById('touch-controls-toggle');
    if (rotateMessage) rotateMessage.style.display = 'none';
    if (canvas) canvas.style.filter = 'none';
    const touchControlsEnabled = localStorage.getItem('touchControlsEnabled') !== 'false';
    if (mobileControls) {
        mobileControls.style.display = touchControlsEnabled ? 'block' : 'none';
    }
    if (toggleButton) {
        toggleButton.classList.toggle('active', touchControlsEnabled);
    }
}

/**
 * Shows rotate message for narrow portrait mode
 */
function showRotateMessage() {
    const rotateMessage = document.getElementById('rotate-message');
    const mobileControls = document.getElementById('mobile-controls');
    const canvas = document.getElementById('canvas');
    if (rotateMessage) rotateMessage.style.display = 'flex';
    if (mobileControls) mobileControls.style.display = 'none';
    if (canvas) canvas.style.filter = 'blur(3px)';
}

/**
 * Shows mobile controls for narrow landscape mode
 */
function showMobileControls() {
    const rotateMessage = document.getElementById('rotate-message');
    const mobileControls = document.getElementById('mobile-controls');
    const canvas = document.getElementById('canvas');
    if (rotateMessage) rotateMessage.style.display = 'none';
    if (mobileControls) mobileControls.style.display = 'block';
    if (canvas) canvas.style.filter = 'none';
}

/**
 * Loads touch controls state from localStorage
 */
function loadTouchControlsState() {
    const touchControlsEnabled = localStorage.getItem('touchControlsEnabled') !== 'false';
    const toggleButton = document.getElementById('touch-controls-toggle');
    if (toggleButton) {
        toggleButton.classList.toggle('active', touchControlsEnabled);
    }
}

/**
 * Toggles touch controls visibility and saves state
 */
function toggleTouchControls() {
    const mobileControls = document.getElementById('mobile-controls');
    const toggleButton = document.getElementById('touch-controls-toggle');
    if (!mobileControls || !toggleButton) return;
    const isCurrentlyVisible = mobileControls.style.display === 'block';
    const newState = !isCurrentlyVisible;
    mobileControls.style.display = newState ? 'block' : 'none';
    toggleButton.classList.toggle('active', newState);
    localStorage.setItem('touchControlsEnabled', newState.toString());
    toggleButton.blur();
}

/**
 * Shows desktop mode (no mobile elements)
 */
function showDesktopMode() {
    const rotateMessage = document.getElementById('rotate-message');
    const mobileControls = document.getElementById('mobile-controls');
    const canvas = document.getElementById('canvas');
    const toggleButton = document.getElementById('touch-controls-toggle');
    if (rotateMessage) rotateMessage.style.display = 'none';
    if (mobileControls) mobileControls.style.display = 'none';
    if (canvas) canvas.style.filter = 'none';
    if (toggleButton) toggleButton.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const impressumModal = document.getElementById('impressum-modal');
    impressumModal.addEventListener('click', function(event) {
        if (event.target === impressumModal) {
            closeImpressum();
        }
    });
    initMobileControls();
});
