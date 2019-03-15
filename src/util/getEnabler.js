let prom = null;
const limit = 10000;
let count = 0;

export default function getEnabler() {
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
