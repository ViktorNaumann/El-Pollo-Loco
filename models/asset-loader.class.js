/**
 * AssetLoader class
 * Handles preloading of all game assets (images and audio files)
 * Shows loading progress to the user
 */
class AssetLoader {
  constructor() {
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.loadedImages = {};
    this.loadedAudio = {};
    this.onProgressCallback = null;
    this.onCompleteCallback = null;
  }

  /**
   * Sets callback function for progress updates
   * @param {Function} callback - Function to call on progress (receives percentage)
   */
  setProgressCallback(callback) {
    this.onProgressCallback = callback;
  }

  /**
   * Sets callback function for completion
   * @param {Function} callback - Function to call when loading is complete
   */
  setCompleteCallback(callback) {
    this.onCompleteCallback = callback;
  }

  /**
   * Starts loading all game assets
   */
  async loadAllAssets() {
    const imageAssets = this.getAllImagePaths();
    const audioAssets = this.getAllAudioPaths();
    this.totalAssets = imageAssets.length + audioAssets.length;
    this.loadedAssets = 0;
    const imagePromises = imageAssets.map(path => this.loadImage(path));
    const audioPromises = audioAssets.map(path => this.loadAudio(path));
    try {
      await Promise.all([...imagePromises, ...audioPromises]);
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  /**
   * Loads a single image
   * @param {string} path - Path to the image
   */
  loadImage(path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages[path] = img;
        this.updateProgress();
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${path}`);
        this.updateProgress();
        resolve(null);
      };
      img.src = path;
    });
  }

  /**
   * Loads a single audio file
   * @param {string} path - Path to the audio file
   */
  loadAudio(path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.loadedAudio[path] = audio;
        this.updateProgress();
        resolve(audio);
      };
      audio.onerror = () => {
        console.warn(`Failed to load audio: ${path}`);
        this.updateProgress();
        resolve(null);
      };
      audio.src = path;
    });
  }

  /**
   * Updates loading progress and calls progress callback
   */
  updateProgress() {
    this.loadedAssets++;
    const percentage = Math.round((this.loadedAssets / this.totalAssets) * 100);
    
    if (this.onProgressCallback) {
      this.onProgressCallback(percentage);
    }
  }

  /**
   * Returns all image paths used in the game
   */
  getAllImagePaths() {
    return [
      // Character images
      'img/2_character_pepe/1_idle/idle/I-1.png',
      'img/2_character_pepe/1_idle/idle/I-2.png',
      'img/2_character_pepe/1_idle/idle/I-3.png',
      'img/2_character_pepe/1_idle/idle/I-4.png',
      'img/2_character_pepe/1_idle/idle/I-5.png',
      'img/2_character_pepe/1_idle/idle/I-6.png',
      'img/2_character_pepe/1_idle/idle/I-7.png',
      'img/2_character_pepe/1_idle/idle/I-8.png',
      'img/2_character_pepe/1_idle/idle/I-9.png',
      'img/2_character_pepe/1_idle/idle/I-10.png',
      'img/2_character_pepe/1_idle/long_idle/I-11.png',
      'img/2_character_pepe/1_idle/long_idle/I-12.png',
      'img/2_character_pepe/1_idle/long_idle/I-13.png',
      'img/2_character_pepe/1_idle/long_idle/I-14.png',
      'img/2_character_pepe/1_idle/long_idle/I-15.png',
      'img/2_character_pepe/1_idle/long_idle/I-16.png',
      'img/2_character_pepe/1_idle/long_idle/I-17.png',
      'img/2_character_pepe/1_idle/long_idle/I-18.png',
      'img/2_character_pepe/1_idle/long_idle/I-19.png',
      'img/2_character_pepe/1_idle/long_idle/I-20.png',
      
      // Walking images
      'img/2_character_pepe/2_walk/W-21.png',
      'img/2_character_pepe/2_walk/W-22.png',
      'img/2_character_pepe/2_walk/W-23.png',
      'img/2_character_pepe/2_walk/W-24.png',
      'img/2_character_pepe/2_walk/W-25.png',
      'img/2_character_pepe/2_walk/W-26.png',
      
      // Jumping images
      'img/2_character_pepe/3_jump/J-31.png',
      'img/2_character_pepe/3_jump/J-32.png',
      'img/2_character_pepe/3_jump/J-33.png',
      'img/2_character_pepe/3_jump/J-34.png',
      'img/2_character_pepe/3_jump/J-35.png',
      'img/2_character_pepe/3_jump/J-36.png',
      'img/2_character_pepe/3_jump/J-37.png',
      'img/2_character_pepe/3_jump/J-38.png',
      'img/2_character_pepe/3_jump/J-39.png',
      
      // Hurt images
      'img/2_character_pepe/4_hurt/H-41.png',
      'img/2_character_pepe/4_hurt/H-42.png',
      'img/2_character_pepe/4_hurt/H-43.png',
      
      // Dead images
      'img/2_character_pepe/5_dead/D-51.png',
      'img/2_character_pepe/5_dead/D-52.png',
      'img/2_character_pepe/5_dead/D-53.png',
      'img/2_character_pepe/5_dead/D-54.png',
      'img/2_character_pepe/5_dead/D-55.png',
      'img/2_character_pepe/5_dead/D-56.png',
      'img/2_character_pepe/5_dead/D-57.png',
      
      // Chicken enemies
      'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
      'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
      'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
      'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
      'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
      'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
      
      // Endboss
      'img/4_enemie_boss_chicken/1_walk/G1.png',
      'img/4_enemie_boss_chicken/1_walk/G2.png',
      'img/4_enemie_boss_chicken/1_walk/G3.png',
      'img/4_enemie_boss_chicken/1_walk/G4.png',
      'img/4_enemie_boss_chicken/2_alert/G5.png',
      'img/4_enemie_boss_chicken/2_alert/G6.png',
      'img/4_enemie_boss_chicken/2_alert/G7.png',
      'img/4_enemie_boss_chicken/2_alert/G8.png',
      'img/4_enemie_boss_chicken/2_alert/G9.png',
      'img/4_enemie_boss_chicken/2_alert/G10.png',
      'img/4_enemie_boss_chicken/2_alert/G11.png',
      'img/4_enemie_boss_chicken/2_alert/G12.png',
      'img/4_enemie_boss_chicken/3_attack/G13.png',
      'img/4_enemie_boss_chicken/3_attack/G14.png',
      'img/4_enemie_boss_chicken/3_attack/G15.png',
      'img/4_enemie_boss_chicken/3_attack/G16.png',
      'img/4_enemie_boss_chicken/3_attack/G17.png',
      'img/4_enemie_boss_chicken/3_attack/G18.png',
      'img/4_enemie_boss_chicken/3_attack/G19.png',
      'img/4_enemie_boss_chicken/3_attack/G20.png',
      'img/4_enemie_boss_chicken/4_hurt/G21.png',
      'img/4_enemie_boss_chicken/4_hurt/G22.png',
      'img/4_enemie_boss_chicken/4_hurt/G23.png',
      'img/4_enemie_boss_chicken/5_dead/G24.png',
      'img/4_enemie_boss_chicken/5_dead/G25.png',
      'img/4_enemie_boss_chicken/5_dead/G26.png',
      
      // Background
      'img/5_background/layers/air.png',
      'img/5_background/layers/3_third_layer/1.png',
      'img/5_background/layers/3_third_layer/2.png',
      'img/5_background/layers/2_second_layer/1.png',
      'img/5_background/layers/2_second_layer/2.png',
      'img/5_background/layers/1_first_layer/1.png',
      'img/5_background/layers/1_first_layer/2.png',
      
      // Clouds
      'img/5_background/layers/4_clouds/1.png',
      'img/5_background/layers/4_clouds/2.png',
      
      // Bottles
      'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
      'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
      'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
      'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
      'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
      'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
      
      // Status bar icons (only the ones that exist)
      'img/7_statusbars/3_icons/icon_coin.png',
      'img/7_statusbars/3_icons/icon_health.png',
      'img/7_statusbars/3_icons/icon_salsa_bottle.png',
      
      // Coins
      'img/8_coin/coin_1.png',
      'img/8_coin/coin_2.png',
      
      // Intro/Outro screens
      'img/9_intro_outro_screens/start/startscreen_1.png',
      'img/9_intro_outro_screens/game_over/game over.png',
      'img/9_intro_outro_screens/game_over/oh no you lost!.png',
      'img/You won, you lost/You won A.png',
      'img/You won, you lost/You Won B.png',
      
      // UI elements
      'img/sound-off.png',
      'img/sound-on.png',
      
      // Desert background elements
      'img/desert_background/desert.png',
      'img/desert_background/Steppenhexe.png'
    ];
  }

  /**
   * Returns all audio paths used in the game
   */
  getAllAudioPaths() {
    return [
      'audio/background1.mp3',
      'audio/background2.mp3',
      'audio/boss_hurt.mp3',
      'audio/break.mp3',
      'audio/collect_coin.mp3',
      'audio/collect.mp3',
      'audio/endboss_fight.mp3',
      'audio/hit.mp3',
      'audio/jump.mp3',
      'audio/lost_sound.mp3',
      'audio/lost_speak.mp3',
      'audio/run.mp3',
      'audio/squeeze_chicken.mp3',
      'audio/throw.mp3',
      'audio/win_sound.mp3'
    ];
  }

  /**
   * Gets a preloaded image
   * @param {string} path - Path to the image
   * @returns {Image|null} The preloaded image or null if not found
   */
  getImage(path) {
    return this.loadedImages[path] || null;
  }

  /**
   * Gets a preloaded audio
   * @param {string} path - Path to the audio
   * @returns {Audio|null} The preloaded audio or null if not found
   */
  getAudio(path) {
    return this.loadedAudio[path] || null;
  }
}
