/**
 * AudioManager class
 * Manages all game audio effects and background music
 * Handles volume control, fading effects, and mute states
 */
class AudioManager {
  hitSound;
  throwSound;
  breakSound;
  bossHurtSound;
  collectSound;
  squeezeChickenSound;
  collectCoin;
  endbossFightMusic;
  endbossMusicPlayed = false;
  winSound;
  lostSound;
  lostSpeakSound;
  landingSound;

  /**
   * Creates a new AudioManager instance and initializes all audio files
   */
  constructor() {
    this.initializeAudioFiles();
    this.setupAudioProperties();
  }

  /**
   * Initializes all audio file objects
   */
  initializeAudioFiles() {
    this.hitSound = new Audio("audio/hit.mp3");
    this.throwSound = new Audio("audio/throw.mp3");
    this.breakSound = new Audio("audio/break.mp3");
    this.bossHurtSound = new Audio("audio/boss_hurt.mp3");
    this.collectSound = new Audio("audio/collect.mp3");
    this.squeezeChickenSound = new Audio("audio/squeeze_chicken.mp3");
    this.collectCoin = new Audio("audio/collect_coin.mp3");
    this.endbossFightMusic = new Audio("audio/endboss_fight.mp3");
    this.winSound = new Audio("audio/win_sound.mp3");
    this.lostSound = new Audio("audio/lost_sound.mp3");
    this.lostSpeakSound = new Audio("audio/lost_speak.mp3");
    this.landingSound = new Audio("audio/landing.mp3");
  }

  /**
   * Sets up audio properties like volume and loop settings
   */
  setupAudioProperties() {
    this.bossHurtSound.volume = 0.4;
    this.endbossFightMusic.loop = true;
  }

  /**
   * Plays the hit sound effect
   */
  playHitSound() {
    window.playSound(this.hitSound, 0.5);
  }

  /**
   * Plays the throw sound effect
   */
  playThrowSound() {
    window.playSound(this.throwSound, 0.3);
  }

  /**
   * Plays the break sound effect
   */
  playBreakSound() {
    window.playSound(this.breakSound, 0.5);
  }

  /**
   * Plays the boss hurt sound effect
   */
  playBossHurtSound() {
    window.playSound(this.bossHurtSound, 0.4);
  }

  /**
   * Plays the collect sound effect
   */
  playCollectSound() {
    window.playSound(this.collectSound, 0.5);
  }

  /**
   * Plays the squeeze chicken sound effect
   */
  playSqueezeChickenSound() {
    window.playSound(this.squeezeChickenSound, 0.5);
  }

  /**
   * Plays the collect coin sound effect
   */
  playCollectCoinSound() {
    window.playSound(this.collectCoin, 0.5);
  }

  /**
   * Plays the landing sound effect
   */
  playLandingSound() {
    window.playSound(this.landingSound, 0.3);
  }

  /**
   * Plays the win sound effect
   */
  playWinSound() {
    window.playSound(this.winSound, 0.7);
  }

  /**
   * Plays the lost sound effect and chains with speak sound
   */
  playLostSound() {
    window.playSound(this.lostSound, 0.9);
    this.lostSound.onended = () => {
      if (!window.isMuted) {
        window.playSound(this.lostSpeakSound, 0.9);
      }
    };
  }

  /**
   * Starts the endboss fight music with fade in effect
   */
  startEndbossFightMusic() {
    if (this.endbossMusicPlayed) return;

    // Fade out background music and wind sound
    if (window.backgroundMusic) {
      this.fadeOutAudio(window.backgroundMusic);
    }
    if (window.windSound) {
      this.fadeOutAudio(window.windSound);
    }

    // Start endboss music
    if (!window.isMuted) {
      this.endbossFightMusic.volume = 0;
      this.endbossFightMusic.play()
        .then(() => this.fadeInAudio(this.endbossFightMusic, 0.2));
    }
    this.endbossMusicPlayed = true;
  }

  /**
   * Stops the endboss fight music with fade out effect
   */
  stopEndbossFightMusic() {
    if (this.endbossFightMusic) {
      this.fadeOutAudio(this.endbossFightMusic);
    }
  }

  /**
   * Gradually decreases audio volume until silent
   * @param {HTMLAudioElement} audio - The audio element to fade out
   */
  fadeOutAudio(audio) {
    if (!audio || window.isMuted) return;
    const originalVolume = audio.volume;
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.pause();
        audio.volume = originalVolume;
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  /**
   * Gradually increases audio volume to target level
   * @param {HTMLAudioElement} audio - The audio element to fade in
   * @param {number} targetVolume - Target volume level
   */
  fadeInAudio(audio, targetVolume = 0.2) {
    if (!audio || window.isMuted) return;
    audio.volume = 0.05;
    const fadeInterval = setInterval(() => {
      if (window.isMuted) {
        audio.volume = 0;
        clearInterval(fadeInterval);
        return;
      }
      if (audio.volume < targetVolume - 0.05) {
        audio.volume += 0.05;
      } else {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  /**
   * Fades out all game audio when game ends
   */
  fadeOutAllAudio() {
    if (window.backgroundMusic) {
      this.fadeOutAudio(window.backgroundMusic);
    }
    if (window.windSound) {
      this.fadeOutAudio(window.windSound);
    }
    this.stopEndbossFightMusic();
  }

  /**
   * Immediately stops all game audio (for game over scenarios)
   */
  stopAllAudio() {
    if (window.backgroundMusic) {
      window.backgroundMusic.pause();
      window.backgroundMusic.currentTime = 0;
    }
    if (window.windSound) {
      window.windSound.pause();
      window.windSound.currentTime = 0;
    }
    if (this.endbossFightMusic) {
      this.endbossFightMusic.pause();
      this.endbossFightMusic.currentTime = 0;
    }
  }
}
