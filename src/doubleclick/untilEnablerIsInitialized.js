import loadScript from '../util/loadScript';
import getEnabler from '../util/getEnabler';

export default function untilEnablerIsInitialized() {

  let prom = Promise.resolve();

  if (!window.Enabler) {
    prom = prom.then(() => loadScript('https://s0.2mdn.net/ads/studio/Enabler.js'));
  }

  prom = prom.then(() => getEnabler())

  prom = prom.then(Enabler => {
      return new Promise(resolve => {
        if (!Enabler.isInitialized()) {
          Enabler.addEventListener(studio.events.StudioEvent.INIT, resolve);
        } else {
          resolve();
        }
      });
    });

  return prom;
}
