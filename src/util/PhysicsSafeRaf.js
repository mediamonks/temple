/**
 * @description
 *
 *   const raf = new Raf((time, diff) => {
 *     // do animation diff is the time difference between this frame and the previous frame
 *   }).start()
 *
 *   // stop animation.
 *   raf.stop();
 */
export default class PhysicsSafeRaf {
  rafNum = -1;
  currentTime = 0;

  /**
   *
   * @param {Function} callback
   * @param limitFps
   */
  constructor(callback, limitFps = -1) {
    this.callback = callback;
    this.limitFps = limitFps;

    this.hasLimiter = limitFps > 0;
    this.limitMsps = 1000 / limitFps;
    this.timeAcc = this.limitMsps;
  }

  tick = timestamp => {
    this.rafNum = window.requestAnimationFrame(this.tick);
    const timeDiff = timestamp - this.currentTime;
    this.currentTime = timestamp;

    if (timeDiff > 0 && !this.hasLimiter) {
      this.callback.call(null, timestamp, timeDiff);
    } else if (timeDiff > 0) {
      this.timeAcc += timeDiff;
      while (this.timeAcc > this.limitMsps) {
        this.timeAcc -= this.limitMsps;
        this.callback.call(null, timestamp, this.limitMsps);
      }
    }
  };

  valueOf = () => this.rafNum;
  start = () => {
    if (this.rafNum === -1) {
      this.tick();
    }

    return this;
  };
  stop = () => {
    cancelAnimationFrame(this.rafNum);
    this.rafNum = -1;

    return this;
  };
}
