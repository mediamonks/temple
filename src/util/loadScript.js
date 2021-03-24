/**
 * Load a JavaScript file.
 *
 * @param {String} url Script file url. A string array of url's also possible.
 * @param {Object} [opt] Callback function when file loaded.
 * @retun {Promise}
 */
export default function loadScript(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const head = document.head || document.querySelector('head');
    const script = document.createElement('script');
    script.type = opts.type || 'text/javascript';
    script.charset = opts.charset || 'utf8';
    script.async = true;
    script.onload = function() {
      this.onerror = this.onload = null;
      resolve(script);
    };

    script.onerror = function() {
      this.onerror = this.onload = null;
      reject(new Error(`Failed to load ${this.src}`), script);
    };

    script.src = url;

    head.appendChild(script);
  });
}
