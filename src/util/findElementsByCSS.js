import findElementByCSS from './findElementByCSS';

/**
 *
 * @param {HTMLElement} element
 * @param {Array<string>} styles
 * @param {string} sheet
 * @return {{all}}
 */
export default function findElementsByCSS(element, styles, sheet) {
  let obj;
  if (styles) {
    obj = findElementByCSS(element, styles, sheet);
  } else {
    obj = findElementByCSS(element);
  }

  return obj;
}
