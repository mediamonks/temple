let promise = null;
let promInitialized = null;
const limit = 10000;
let count = 0;

export default async function getEnabler(isInitialized = true) {
  if (!window.Enabler) {
    await new Promise(resolve => {
      const checkLoop = function() {
        if (window.Enabler) {
          resolve(window.Enabler);
        } else {
          setTimeout(checkLoop, 500);
        }
      };

      checkLoop();
    });
  }

  if (isInitialized) {
    if (!promInitialized) {
      promInitialized = getEnabler(false).then(Enabler => {
        return new Promise(resolve => {
          const resolver = () => {
            Enabler.removeEventListener(studio.events.StudioEvent.INIT, resolver);
            resolve(Enabler);
          };
          Enabler.addEventListener(studio.events.StudioEvent.INIT, resolver);
        });
      });
    }

    return promInitialized;
  }

  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const checkLoop = function() {
        if (!!Enabler) {
          resolve(Enabler);
        } else {
          setTimeout(checkLoop, 500);
        }
      };

      checkLoop();
    });
  }

  return prom;
}
