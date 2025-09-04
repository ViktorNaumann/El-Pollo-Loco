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
    
    this.removeMobileListeners();
    this.deactivated = true;
  }

  /**
   * Binds keyboard event listeners to detect key presses
   * and updates the corresponding control states
   */
  bind() {
    this.bindKeyboardEvents();
    this.bindMobileEvents();
  }

  /**
   * Binds keyboard events for desktop controls
   */
  bindKeyboardEvents() {
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

  /**
   * Binds mobile touch events for mobile controls
   */
  bindMobileEvents() {
    // Mobile Left Button
    const mobileLeft = document.getElementById('mobile-left');
    if (mobileLeft) {
      this.mobileLeftStart = (e) => {
        e.preventDefault();
        this.LEFT = true;
        mobileLeft.classList.add('pressed');
      };
      this.mobileLeftEnd = (e) => {
        e.preventDefault();
        this.LEFT = false;
        mobileLeft.classList.remove('pressed');
      };
      
      mobileLeft.addEventListener('touchstart', this.mobileLeftStart, { passive: false });
      mobileLeft.addEventListener('touchend', this.mobileLeftEnd, { passive: false });
      mobileLeft.addEventListener('touchcancel', this.mobileLeftEnd, { passive: false });
      mobileLeft.addEventListener('mousedown', this.mobileLeftStart);
      mobileLeft.addEventListener('mouseup', this.mobileLeftEnd);
      mobileLeft.addEventListener('mouseleave', this.mobileLeftEnd);
    }

    // Mobile Right Button
    const mobileRight = document.getElementById('mobile-right');
    if (mobileRight) {
      this.mobileRightStart = (e) => {
        e.preventDefault();
        this.RIGHT = true;
        mobileRight.classList.add('pressed');
      };
      this.mobileRightEnd = (e) => {
        e.preventDefault();
        this.RIGHT = false;
        mobileRight.classList.remove('pressed');
      };
      
      mobileRight.addEventListener('touchstart', this.mobileRightStart, { passive: false });
      mobileRight.addEventListener('touchend', this.mobileRightEnd, { passive: false });
      mobileRight.addEventListener('touchcancel', this.mobileRightEnd, { passive: false });
      mobileRight.addEventListener('mousedown', this.mobileRightStart);
      mobileRight.addEventListener('mouseup', this.mobileRightEnd);
      mobileRight.addEventListener('mouseleave', this.mobileRightEnd);
    }

    // Mobile Jump Button
    const mobileJump = document.getElementById('mobile-jump');
    if (mobileJump) {
      this.mobileJumpStart = (e) => {
        e.preventDefault();
        this.SPACE = true;
        mobileJump.classList.add('pressed');
      };
      this.mobileJumpEnd = (e) => {
        e.preventDefault();
        this.SPACE = false;
        mobileJump.classList.remove('pressed');
      };
      
      mobileJump.addEventListener('touchstart', this.mobileJumpStart, { passive: false });
      mobileJump.addEventListener('touchend', this.mobileJumpEnd, { passive: false });
      mobileJump.addEventListener('touchcancel', this.mobileJumpEnd, { passive: false });
      mobileJump.addEventListener('mousedown', this.mobileJumpStart);
      mobileJump.addEventListener('mouseup', this.mobileJumpEnd);
      mobileJump.addEventListener('mouseleave', this.mobileJumpEnd);
    }

    // Mobile Throw Button
    const mobileThrow = document.getElementById('mobile-throw');
    if (mobileThrow) {
      this.mobileThrowStart = (e) => {
        e.preventDefault();
        this.D = true;
        mobileThrow.classList.add('pressed');
      };
      this.mobileThrowEnd = (e) => {
        e.preventDefault();
        this.D = false;
        mobileThrow.classList.remove('pressed');
      };
      
      mobileThrow.addEventListener('touchstart', this.mobileThrowStart, { passive: false });
      mobileThrow.addEventListener('touchend', this.mobileThrowEnd, { passive: false });
      mobileThrow.addEventListener('touchcancel', this.mobileThrowEnd, { passive: false });
      mobileThrow.addEventListener('mousedown', this.mobileThrowStart);
      mobileThrow.addEventListener('mouseup', this.mobileThrowEnd);
      mobileThrow.addEventListener('mouseleave', this.mobileThrowEnd);
    }
  }

  /**
   * Removes mobile event listeners
   */
  removeMobileListeners() {
    const mobileLeft = document.getElementById('mobile-left');
    const mobileRight = document.getElementById('mobile-right');
    const mobileJump = document.getElementById('mobile-jump');
    const mobileThrow = document.getElementById('mobile-throw');

    if (mobileLeft && this.mobileLeftStart) {
      mobileLeft.removeEventListener('touchstart', this.mobileLeftStart);
      mobileLeft.removeEventListener('touchend', this.mobileLeftEnd);
      mobileLeft.removeEventListener('touchcancel', this.mobileLeftEnd);
      mobileLeft.removeEventListener('mousedown', this.mobileLeftStart);
      mobileLeft.removeEventListener('mouseup', this.mobileLeftEnd);
      mobileLeft.removeEventListener('mouseleave', this.mobileLeftEnd);
    }

    if (mobileRight && this.mobileRightStart) {
      mobileRight.removeEventListener('touchstart', this.mobileRightStart);
      mobileRight.removeEventListener('touchend', this.mobileRightEnd);
      mobileRight.removeEventListener('touchcancel', this.mobileRightEnd);
      mobileRight.removeEventListener('mousedown', this.mobileRightStart);
      mobileRight.removeEventListener('mouseup', this.mobileRightEnd);
      mobileRight.removeEventListener('mouseleave', this.mobileRightEnd);
    }

    if (mobileJump && this.mobileJumpStart) {
      mobileJump.removeEventListener('touchstart', this.mobileJumpStart);
      mobileJump.removeEventListener('touchend', this.mobileJumpEnd);
      mobileJump.removeEventListener('touchcancel', this.mobileJumpEnd);
      mobileJump.removeEventListener('mousedown', this.mobileJumpStart);
      mobileJump.removeEventListener('mouseup', this.mobileJumpEnd);
      mobileJump.removeEventListener('mouseleave', this.mobileJumpEnd);
    }

    if (mobileThrow && this.mobileThrowStart) {
      mobileThrow.removeEventListener('touchstart', this.mobileThrowStart);
      mobileThrow.removeEventListener('touchend', this.mobileThrowEnd);
      mobileThrow.removeEventListener('touchcancel', this.mobileThrowEnd);
      mobileThrow.removeEventListener('mousedown', this.mobileThrowStart);
      mobileThrow.removeEventListener('mouseup', this.mobileThrowEnd);
      mobileThrow.removeEventListener('mouseleave', this.mobileThrowEnd);
    }
  }
}
