import getStyleRuleValue from './getStyleRuleValue';

const basicElementsToSearch = ['div', 'span', 'img', 'canvas', 'svg', 'circle', 'path'];

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
  const elementsToSearch = basicElementsToSearch.concat(customTypes);

  if (element && element.childNodes && element.childNodes.length > 0) {
    const children = Array.from(element.querySelectorAll('*'));
    children.forEach(child => {
      if (
        child.type === 'image/svg+xml' ||
        elementsToSearch.indexOf(child.nodeName.toLowerCase()) !== -1
      ) {
        if (child.id || child.className) {
          if (styles) {
            styles = typeof styles === 'string' ? [styles] : styles;

            styles.forEach(style => {
              if (!obj[style]) {
                obj[style] = [];
              }

              if (child.id && obj[style].indexOf(child) === -1) {
                const val = getStyleRuleValue(`.${style}`, `#${child.id}`, sheet);
                if (val) {
                  obj[style].push(child);
                }
              }

              const cssClasses =
                typeof child.className === 'object'
                  ? String(child.className.baseVal).split(' ')
                  : String(child.className).split(' ');

              cssClasses.forEach(cssClass => {
                if (cssClass && obj[style].indexOf(child) === -1) {
                  const val = getStyleRuleValue(`.${style}`, `.${cssClass}`, sheet);
                  if (val && (`.${cssClass}` === val || cssClass === val)) {
                    obj[style].push(child);
                  }
                }
              });
            });

            obj.all.push(child);
            findElementByCSS(child, styles, customTypes, sheet, obj);
          } else {
            obj.push(child);
            findElementByCSS(child, null, null, null, obj);
          }
        }
      }
    });
  }

  return obj;
}
