import findElementByCSS from './findElementByCSS';

export default function findElementsByCSS(element, styles, customTypes, sheet) {
  let obj;
  if (styles) {
    obj = findElementByCSS(element, styles, customTypes, sheet);
  } else {
    obj = findElementByCSS(element);
  }

  return obj;
}
