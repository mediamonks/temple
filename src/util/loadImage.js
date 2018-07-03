/**
 * Preload an image.
 *
 * @method temple.utils.loadImage
 * @param {String || Array} url Image file url. A string array of url's also possible.
 * @param {Function} [callback] Callback function when file loaded.
 * @param {Function} [error] Error function when file not loaded.
 */
export default function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = function(e) {
      resolve(this);
    };
    img.onerror = reject;
    img.src = src;
  });
}
