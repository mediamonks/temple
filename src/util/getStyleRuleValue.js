export default function getStyleRuleValue(style, selector, sheet) {
  const sheets = [];
  for (var k in document.styleSheets) {
    if (
      document.styleSheets[k].href &&
      (document.styleSheets[k].href.indexOf('style.css') != -1 ||
        document.styleSheets[k].href.indexOf(sheet) != -1)
    ) {
      sheets.push(document.styleSheets[k]);
    }
  }

  for (let i = 0, l = sheets.length; i < l; i++) {
    let sheet = sheets[i];
    if (!sheet.cssRules) continue;
    for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
      var rule = sheet.cssRules[j];
      if (rule.selectorText) {
        if (rule.selectorText.indexOf(selector) != -1 && rule.selectorText.indexOf(style) != -1) {
          var all = rule.selectorText.substring(0, rule.selectorText.indexOf(style)).split('.');
          var node = all[all.length - 1];
          return node;
        }
      }
    }
  }
  return;
}
