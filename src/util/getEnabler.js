let prom = null;

export default function getEnabler() {
  if (!prom) {
    prom = new Promise((resolve, reject) => {
      const limit = 100;
      let count = 0;

      const checkLoop = function() {
        if (count > limit) {
          reject(new Error('Enabler not found'));
        }
        if (window.Enabler) {
          resolve(window.Enabler);
        } else {
          count++;
          setTimeout(checkLoop, 100);
        }
      };

      checkLoop();
    });
  }

  return prom;
}
