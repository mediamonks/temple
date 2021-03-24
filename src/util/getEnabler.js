/* eslint-disable no-undef */

let prom = null;

export default function getEnabler() {
  if (!prom) {
    prom = new Promise(resolve => {
      const checkLoop = function() {
        if (Enabler) {
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
