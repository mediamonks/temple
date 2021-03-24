/**
 * Load Image
 * @param src
 * @return {Promise<HTMLImageElement>}
 */
export default function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = function() {
      resolve(this);
    };
    img.onerror = reject;
    img.src = src;
  });
}
