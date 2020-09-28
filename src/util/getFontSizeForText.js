let _canvas = null;
function getCanvas() {
  if (!_canvas) {
    _canvas = document.createElement('canvas');
  }
  return _canvas;
}

/**
 * Returns the font size ideal for the indicated with.
 *
 * @param {string} text copy
 * @param {number} maxFontSizeInPixels Starting max font size
 * @param {string} fontFamily font family that the copy is using.
 * @param {number} width width that the text needs to fit in.
 */
export default function getFontSizeForText(text, maxFontSizeInPixels, fontFamily, width) {
  const ctx = getCanvas().getContext('2d');

  // if(!fontTest.test(font)){
  //   throw new Error('font string not valid');
  // }

  let isValid = false;
  while (!isValid) {
    ctx.font = `${maxFontSizeInPixels}px ${fontFamily}`;
    if (ctx.measureText(text).width < width) {
      isValid = true;
    } else {
      // eslint-disable-next-line no-plusplus
      maxFontSizeInPixels--;
    }
  }

  return maxFontSizeInPixels;
}
