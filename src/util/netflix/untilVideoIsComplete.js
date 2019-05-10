export default function untilVideoIsComplete(netflixVideo, durationFromEnd) {
  return new Promise(resolve => {
    const tick = e => {
      // console.log(e.detail.currentTime, e.detail.duration);
      if (e.detail.currentTime > e.detail.duration - durationFromEnd) {
        resolve();
        netflixVideo.removeEventListener('video-time', tick);
      }
    };
    netflixVideo.addEventListener('video-time', tick);
  });
}
