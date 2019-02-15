import findElementByCSS from './findElementByCSS';

export default function findElementsByCSS(element, styles, sheet) {
  var obj;
  if (styles) {
    obj = findElementByCSS(element, styles, sheet);
  } else {
    obj = findElementByCSS(element);
  }

  return obj;
}
