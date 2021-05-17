
/**
 *
 * @param {string} id
 * @param {HTMLVideoElement} videoElement
 */
export default function addVideoTracking(id, videoElement) {
  if (!studio.video) {
    Enabler.loadModule(studio.module.ModuleId.VIDEO, () => {
      this.addVideoTracking(id, videoElement);
    });
    return;
  }

  studio.video.Reporter.attach(id, videoElement);
}
