/**
 * Keyboard class
 * Handles keyboard input detection for game controls
 */
class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  D = false;

  /**
   * Deactivates keyboard controls by removing event listeners
   * or setting a flag to ignore inputs
   */
  deactivate() {
    if (this.keydownListener) {
      window.removeEventListener('keydown', this.keydownListener);
    }
    if (this.keyupListener) {
      window.removeEventListener('keyup', this.keyupListener);
    }
    
    this.deactivated = true;
  }

  /**
   * Binds keyboard event listeners to detect key presses
   * and updates the corresponding control states
   */
  bind() {
    this.keydownListener = (e) => {
      if (this.deactivated) return;
      
      if (e.code === 'ArrowLeft') this.LEFT = true;
      if (e.code === 'ArrowRight') this.RIGHT = true;
      if (e.code === 'ArrowUp') this.UP = true;
      if (e.code === 'ArrowDown') this.DOWN = true;
      if (e.code === 'Space') this.SPACE = true;
      if (e.code === 'KeyD') this.D = true;
    };
    
    this.keyupListener = (e) => {
      if (this.deactivated) return;
      
      if (e.code === 'ArrowLeft') this.LEFT = false;
      if (e.code === 'ArrowRight') this.RIGHT = false;
      if (e.code === 'ArrowUp') this.UP = false;
      if (e.code === 'ArrowDown') this.DOWN = false;
      if (e.code === 'Space') this.SPACE = false;
      if (e.code === 'KeyD') this.D = false;
    };
    
    window.addEventListener('keydown', this.keydownListener);
    window.addEventListener('keyup', this.keyupListener);
  }
}
