export default function untilVideoIsComplete(domNetflixVideo, durationFromEnd = 0) {
  return new Promise(resolve => {
    const onComplete = e => {
      resolve();
      domNetflixVideo.removeEventListener('video-complete', onComplete);
      domNetflixVideo.removeEventListener('video-close', onComplete);
    };
    domNetflixVideo.addEventListener('video-close', onComplete);
    domNetflixVideo.addEventListener('video-complete', onComplete);

    const tick = e => {
      if (e.detail.duration > 0 && e.detail.currentTime > e.detail.duration - durationFromEnd) {
        resolve();
        domNetflixVideo.removeEventListener('video-time', tick);
      }
    };
    domNetflixVideo.addEventListener('video-time', tick);
  });
}
