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
    this.keydownListener = (e) => this.handleKeyDown(e);
    this.keyupListener = (e) => this.handleKeyUp(e);
    window.addEventListener('keydown', this.keydownListener);
    window.addEventListener('keyup', this.keyupListener);
  }

  /**
   * Handles keydown events
   */
  handleKeyDown(e) {
    if (this.deactivated) return;
    if (e.code === 'ArrowLeft') this.LEFT = true;
    if (e.code === 'ArrowRight') this.RIGHT = true;
    if (e.code === 'ArrowUp') this.UP = true;
    if (e.code === 'ArrowDown') this.DOWN = true;
    if (e.code === 'Space') this.SPACE = true;
    if (e.code === 'KeyD') this.D = true;
  }

  /**
   * Handles keyup events
   */
  handleKeyUp(e) {
    if (this.deactivated) return;  
    if (e.code === 'ArrowLeft') this.LEFT = false;
    if (e.code === 'ArrowRight') this.RIGHT = false;
    if (e.code === 'ArrowUp') this.UP = false;
    if (e.code === 'ArrowDown') this.DOWN = false;
    if (e.code === 'Space') this.SPACE = false;
    if (e.code === 'KeyD') this.D = false;
  }

  /**
   * Binds mobile touch events for mobile controls
   */
  bindMobileEvents() {
    this.bindMobileLeftEvents();
    this.bindMobileRightEvents();
    this.bindMobileJumpEvents();
    this.bindMobileThrowEvents();
  }

  /**
   * Binds events for mobile left control
   */
  bindMobileLeftEvents() {
    const mobileLeft = document.getElementById('mobile-left');
    if (!mobileLeft) return;
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
    this.addMobileEventListeners(mobileLeft, this.mobileLeftStart, this.mobileLeftEnd);
  }

  /**
   * Binds events for mobile right control
   */
  bindMobileRightEvents() {
    const mobileRight = document.getElementById('mobile-right');
    if (!mobileRight) return;
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
    this.addMobileEventListeners(mobileRight, this.mobileRightStart, this.mobileRightEnd);
  }

  /**
   * Binds events for mobile jump control
   */
  bindMobileJumpEvents() {
    const mobileJump = document.getElementById('mobile-jump');
    if (!mobileJump) return;
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
    this.addMobileEventListeners(mobileJump, this.mobileJumpStart, this.mobileJumpEnd);
  }

  /**
   * Binds events for mobile throw control
   */
  bindMobileThrowEvents() {
    const mobileThrow = document.getElementById('mobile-throw');
    if (!mobileThrow) return;
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
    this.addMobileEventListeners(mobileThrow, this.mobileThrowStart, this.mobileThrowEnd);
  }

  /**
   * Adds event listeners to a mobile control element
   */
  addMobileEventListeners(element, startHandler, endHandler) {
    element.addEventListener('touchstart', startHandler, { passive: false });
    element.addEventListener('touchend', endHandler, { passive: false });
    element.addEventListener('touchcancel', endHandler, { passive: false });
    element.addEventListener('mousedown', startHandler);
    element.addEventListener('mouseup', endHandler);
    element.addEventListener('mouseleave', endHandler);
  }

  /**
   * Removes mobile event listeners
   */
  removeMobileListeners() {
    this.removeMobileLeftListeners();
    this.removeMobileRightListeners();
    this.removeMobileJumpListeners();
    this.removeMobileThrowListeners();
  }

  /**
   * Removes event listeners for mobile left control
   */
  removeMobileLeftListeners() {
    const mobileLeft = document.getElementById('mobile-left');
    if (mobileLeft && this.mobileLeftStart) {
      this.removeMobileEventListeners(mobileLeft, this.mobileLeftStart, this.mobileLeftEnd);
    }
  }

  /**
   * Removes event listeners for mobile right control
   */
  removeMobileRightListeners() {
    const mobileRight = document.getElementById('mobile-right');
    if (mobileRight && this.mobileRightStart) {
      this.removeMobileEventListeners(mobileRight, this.mobileRightStart, this.mobileRightEnd);
    }
  }

  /**
   * Removes event listeners for mobile jump control
   */
  removeMobileJumpListeners() {
    const mobileJump = document.getElementById('mobile-jump');
    if (mobileJump && this.mobileJumpStart) {
      this.removeMobileEventListeners(mobileJump, this.mobileJumpStart, this.mobileJumpEnd);
    }
  }

  /**
   * Removes event listeners for mobile throw control
   */
  removeMobileThrowListeners() {
    const mobileThrow = document.getElementById('mobile-throw');
    if (mobileThrow && this.mobileThrowStart) {
      this.removeMobileEventListeners(mobileThrow, this.mobileThrowStart, this.mobileThrowEnd);
    }
  }

  /**
   * Removes event listeners from a mobile control element
   */
  removeMobileEventListeners(element, startHandler, endHandler) {
    element.removeEventListener('touchstart', startHandler);
    element.removeEventListener('touchend', endHandler);
    element.removeEventListener('touchcancel', endHandler);
    element.removeEventListener('mousedown', startHandler);
    element.removeEventListener('mouseup', endHandler);
    element.removeEventListener('mouseleave', endHandler);
  }
}
