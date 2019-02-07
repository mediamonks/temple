import getStyleRuleValue from './getStyleRuleValue';

const elementsToSearch = ['DIV', 'SPAN', 'IMG', 'CANVAS', 'SVG', 'CIRCLE', 'PATH'];

export default function findElementByCSS(
  element,
  styles,
  sheet,
  obj = {
    all: [],
  },
) {
  if (element && element.childNodes && element.childNodes.length > 0) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (
        child.type === 'image/svg+xml' ||
        elementsToSearch.indexOf(child.nodeName.toUpperCase()) !== -1
      ) {
        if (child.id || child.className) {
          if (styles) {
            styles = typeof styles === 'string' ? [styles] : styles;

            for (let j = 0; j < styles.length; j++) {
              if (!obj[styles[j]]) {
                obj[styles[j]] = [];
              }

              if (child.id && obj[styles[j]].indexOf(child) === -1) {
                var val = getStyleRuleValue('.' + styles[j], '#' + child.id, sheet);
                if (val) {
                  obj[styles[j]].push(child);
                }
              }

              const c =
                typeof child.className === 'object'
                  ? String(child.className.baseVal).split(' ')
                  : String(child.className).split(' ');

              for (let k = 0; k < c.length; k++) {
                if (c[k] && obj[styles[j]].indexOf(child) === -1) {
                  const val = getStyleRuleValue('.' + styles[j], '.' + c[k], sheet);
                  if (val) {
                    obj[styles[j]].push(child);
                  }
                }
              }
            }
            obj.all.push(child);
            findElementByCSS(child, styles, sheet, obj);
          } else {
            obj.push(child);
            findElementByCSS(child, null, null, obj);
          }
        }
      }
    }
  }

  return obj;
}
