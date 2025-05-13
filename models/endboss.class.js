/**
 * Endboss class
 * Represents the final boss enemy in the game
 * @extends MovableObject
 */
class Endboss extends MovableObject{
  height=400;
  width=300;
  y=50;
  baseSpeed=5.5; 
  speed=this.baseSpeed;
  speedVariationTimer=0;
  attackDistance=5; 
  offset={
    top:100,
    left:50,
    right:50,
    bottom:20,
  };

  IMAGES_ALERT=[
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_WALKING=[
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ATTACK=[
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_HURT=[
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
  ];

  IMAGES_DEAD=[
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /**
   * Creates a new Endboss instance
   */
  constructor(){
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x=3900;
    this.animate();
    this.startRandomSpeedChanges();
  }

  /**
   * Sets up animation and movement intervals for the endboss
   */
  animate(){
    this.animationInterval=setInterval(()=>{
      if(this.isDead() && !this.deadPlayed){
        clearInterval(this.animationInterval);
        this.playAnimationOnce(this.IMAGES_DEAD);
        this.deadPlayed=true;
      }else if(this.isHurt()){
        this.playAnimation(this.IMAGES_HURT);
      }else if(this.isActive && !this.isDead()){
        this.playAnimation(this.IMAGES_WALKING);
      }else{
        this.playAnimation(this.IMAGES_ALERT);
      }
    },150);
    this.moveInterval=setInterval(()=>{
      if(this.isActive && !this.isDead()){
        this.followCharacter();
      }
    },1000/30);
    this.attackInterval=setInterval(()=>{
      if(this.isActive && !this.isDead()){
        this.attackPlayer();
      }
    },1000/10);
  }
  
  /**
   * Creates a shaking visual effect when the boss is hit
   */
  shakeAnimation(){
    const originalX=this.x;
    let offset=15;
    let i=0;
    let interval=setInterval(()=>{
      this.x=originalX+(i%2===0?-offset:offset);
      i++;
      if(i>4){
        clearInterval(interval);
        this.x=originalX;
      }
    },50);
  }
  
  /**
   * Checks if the endboss is currently in hurt state
   * @returns {boolean} True if the endboss is hurt
   */
  isHurt(){
    let timePassed=new Date().getTime()-this.lastHit;
    return timePassed<1000;
  }

  /**
   * Checks if the endboss is dead
   * @returns {boolean} True if the endboss's energy is zero or below
   */
  isDead(){
    return this.energy<=0;
  }

  /**
   * Applies damage to the endboss and handles hurt/death effects
   * @param {number} damage - Amount of damage to apply
   */
  hit(damage=20){
    this.energy-=damage;
    if(this.energy<0)this.energy=0;
    this.lastHit=new Date().getTime();
    this.shakeAnimation();
    if(this.world && this.world.bossHurtSound){
      window.playSound(this.world.bossHurtSound,0.4);
    }
    if(this.energy<=0 && !this.isDying){
      this.isDying=true;
      this.die();
    }
  }

  /**
   * Handles attacking the player when in proximity
   */
  attackPlayer(){
    if(!this.world || !this.world.character || this.isDead())return;
    if(this.isColliding(this.world.character)){
      this.playAnimation(this.IMAGES_ATTACK);
      if(!this.world.character.isHurt()){
        this.world.character.hit(20);
        if(this.world.hitSound){
          window.playSound(this.world.hitSound,0.4);
        }
        this.world.statusBar.setPercentage(this.world.character.energy);
        if(this.world.character.energy<=0){
          this.world.triggerGameOver(false);
        }
      }
    }
  }  

  /**
   * Moves the endboss to follow the player character
   * Includes aggressive pursuit behavior based on distance
   */
  followCharacter(){
    if(!this.world || !this.world.character)return;
    const char=this.world.character;
    const distance=this.x-char.x;
    if(distance>this.attackDistance){
      this.otherDirection=false;
      const speedMultiplier=Math.min(2.0,distance/200);
      this.x-=this.speed*speedMultiplier;
    }else{
      this.attackPlayer();
      this.x-=Math.random()*3-1.5;
    }
  }
  
  /**
   * Implements random speed variations for more dynamic movement
   * Features aggressive speed burst patterns
   */
  startRandomSpeedChanges(){
    setInterval(()=>{
      if(this.isActive){
        const randomFactor=0.9+Math.random()*1.2;
        this.speed=this.baseSpeed*randomFactor;
        if(Math.random()<0.35){
          this.speed=this.baseSpeed*3.5;
          setTimeout(()=>{
            const normalRandomFactor=0.9+Math.random()*1.1;
            this.speed=this.baseSpeed*normalRandomFactor;
          },300+Math.random()*700);
        }
      }
    },1000+Math.random()*2000);
  }
  
  /**
   * Handles the endboss death sequence and triggers victory
   */
  die(){
    this.energy=0;
    clearInterval(this.animationInterval);
    this.playAnimationOnce(this.IMAGES_DEAD);
    this.deadPlayed=true;  
    setTimeout(()=>{
      if(this.world){
        this.world.triggerGameOver(true);
      }
    },1500);
  }
}
