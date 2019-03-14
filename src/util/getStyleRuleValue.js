/**
 *
 * @param {string} style
 * @param {string} selector
 * @param {string} sheet
 * @return {string}
 */
export default function getStyleRuleValue(style, selector, sheet) {
  let result = null;

  const list = Array.from(document.styleSheets).filter(cssStyleSheet => {
    return (
      cssStyleSheet.href &&
      cssStyleSheet.href.indexOf('style.css') !== -1 &&
      cssStyleSheet.href.indexOf(sheet) !== -1
    );
  });

  // list from correct stylesheets
  list.forEach(cssStyleSheet => {
    if (!result && cssStyleSheet.cssRules) {
      Array.from(cssStyleSheet.cssRules).forEach(rule => {
        if (rule.selectorText) {
          if (
            !result &&
            rule.selectorText.indexOf(selector) !== -1 &&
            rule.selectorText.indexOf(style) !== -1
          ) {
            const all = rule.selectorText.substring(0, rule.selectorText.indexOf(style)).split('.');

            result = all[all.length - 1];
          }
        }
      });
    }
  });

  return result;
}
