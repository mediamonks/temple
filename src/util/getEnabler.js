let prom = null;
let promInitialized = null;
const limit = 10000;
let count = 0;

export default function getEnabler(isInitialized = true) {
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

  if (!prom) {
    prom = new Promise((resolve, reject) => {
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
