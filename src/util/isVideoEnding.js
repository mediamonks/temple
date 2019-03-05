/**
 * Will resolve when video is about to end.
 * @param {netflix-video} domNetflixVideo
 * @param {number} offset
 * @return {Promise<any>}
 */
export default function isVideoEnding(domNetflixVideo, offset = 0) {
  return new Promise(resolve => {
    const tick = e => {
      if (e.detail.currentTime >= e.detail.duration - offset) {
        resolve();
        domNetflixVideo.removeEventListener('video-time', tick);
      }
    };
    domNetflixVideo.addEventListener('video-time', tick);
  });
}
