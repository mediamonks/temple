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
      cssStyleSheet.href.indexOf(sheet) !== -1
    );
  });

  // list from correct stylesheets
  list.forEach(cssStyleSheet => {
    var rules;
    try {
      rules = cssStyleSheet.rules || cssStyleSheet.cssRules;

      if (!result && rules) {
        Array.from(rules).forEach(rule => {
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

    } catch(e) {
      result = selector;
    }

  });

  return result;
}
