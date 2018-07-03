export default function raf(callback, limitFps = -1) {
  let rafNum = -1;
  let totalTime = 0;
  const hasLimiter = limitFps > 0;
  const limitMsps = 1000 / limitFps;
  let timeAcc = limitMsps;

  const tick = timestamp => {
    rafNum = window.requestAnimationFrame(tick);
    if (!hasLimiter) {
      callback.call();
    } else if (!totalTime) {
      totalTime = timestamp;
    } else {
      timeAcc += timestamp - totalTime;
      totalTime = timestamp;
      while (timeAcc > limitMsps) {
        timeAcc -= limitMsps;
        callback.call();
      }
    }
  };

  // totalTime = new Date().getTime();
  rafNum = window.requestAnimationFrame(tick);

  return {
    valueOf: () => rafNum,
    start: () => {
      if (rafNum === -1) {
        tick();
      }
    },
    stop: () => {
      cancelAnimationFrame(rafNum);
      rafNum = -1;
    },
    destruct: () => {
      cancelAnimationFrame(rafNum);
      rafNum = null;
    },
  };
}
