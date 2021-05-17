import getEnabler from '../util/getEnabler';

let prom = null;
/**
 * inform the creative as to whether fullscreen is supported.
 *
 * @return {Promise<boolean>}
 */
export default function queryFullscreenSupport() {
  if (!prom) {
    prom = getEnabler().then(Enabler => {
      return new Promise(resolve => {
        const fn = data => {
          Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fn);
          resolve(data);
        };
        Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fn);
      });
    });
  }

  return prom;
}
