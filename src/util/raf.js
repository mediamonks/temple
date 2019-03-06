export default function raf(callback, limitFps = -1) {
  let rafNum = -1;
  let currentTime = 0;
  const hasLimiter = limitFps > 0;
  const limitMsps = 1000 / limitFps;
  let timeAcc = limitMsps;

  const tick = timestamp => {
    rafNum = window.requestAnimationFrame(tick);
    const timeDiff = timestamp - currentTime;
    currentTime = timestamp;

    if (timeDiff > 0 && !hasLimiter) {
      callback.call(null, timestamp, timeDiff);
    } else if (timeDiff > 0) {
      timeAcc += timeDiff;
      while (timeAcc > limitMsps) {
        timeAcc -= limitMsps;
        callback.call(null, timestamp, limitMsps);
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
