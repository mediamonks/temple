import getEnabler from '../util/getEnabler';

let prom = null;

/**
 * Indicates the maximum dimensions available to the creative for fullscreen expansion, as
 * well as the offset of the original creative.
 *
 * If width and height are zero, it means the ad cannot expand to fullscreen. (note that in these
 * circumstances, any studio.events.FULLSCREEN_SUPPORT events will have "supported" set to false).
 * If width and height are not present, it means display width and height cannot be determined in
 * the current ad rendering environment (for example, MRAID 1.0). If left and top are -1, it means
 * that the location of the ad could not be determined.
 *
 * @return {Promise<{width, height, top, left}>}
 */
export default function queryFullscreenDimensions() {
  if (!prom)
  {
    prom = getEnabler().then(Enabler => {
      return new Promise(resolve => {
        const fn = data => {
          Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fn);
          resolve(data);
        };
        Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fn);
      });
    })

  }

  return prom;
}
