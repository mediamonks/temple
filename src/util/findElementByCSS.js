import getStyleRuleValue from './getStyleRuleValue';

let elementsToSearch = ['div', 'span', 'img', 'canvas', 'svg', 'circle', 'path'];

/**
 *
 * @param {HTMLElement} element
 * @param {Array<string>} styles
 * @param {string} sheet
 * @param {object} obj
 * @return {{all: Array}}
 */
export default function findElementByCSS(
  element,
  styles = null,
  customTypes = null,
  sheet = null,
  obj = {
    all: [],
  },
) {
  elementsToSearch = elementsToSearch.concat(customTypes);
  if (element && element.childNodes && element.childNodes.length > 0) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (
        child.type === 'image/svg+xml' ||
        elementsToSearch.indexOf(child.nodeName.toLowerCase()) !== -1
      ) {
        if (child.id || child.className) {
          if (styles) {
            styles = typeof styles === 'string' ? [styles] : styles;

            for (let j = 0; j < styles.length; j++) {
              if (!obj[styles[j]]) {
                obj[styles[j]] = [];
              }

              if (child.id && obj[styles[j]].indexOf(child) === -1) {
                const val = getStyleRuleValue(`.${styles[j]}`, `#${child.id}`, sheet);
                if (val) {
                  obj[styles[j]].push(child);
                }
              }

              const cssClasses =
                typeof child.className === 'object'
                  ? String(child.className.baseVal).split(' ')
                  : String(child.className).split(' ');

              for (let k = 0; k < cssClasses.length; k++) {
                if (cssClasses[k] && obj[styles[j]].indexOf(child) === -1) {
                  const val = getStyleRuleValue(`.${styles[j]}`, `.${cssClasses[k]}`, sheet);
                  if (val && cssClasses[k] == val) {
                    obj[styles[j]].push(child);
                  }
                }
              }
            }
            obj.all.push(child);
            findElementByCSS(child, styles, null, sheet, obj);
          } else {
            obj.push(child);
            findElementByCSS(child, null, null, null, obj);
          }
        }
      }
    }
  }

  return obj;
}
