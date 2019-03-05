import getGlobalStyleSheet from './getGlobalStyleSheet';

/**
 * Programmatically create a css style rule.
 *
 * @param {String} classSelector Class, ID or element selector.
 * @param {String} rules CSS rules.
 */
export default function createStyle(classSelector, rules) {
  classSelector = classSelector !== 'banner' ? `#banner ${classSelector}` : classSelector;

  const styleSheet = getGlobalStyleSheet();

  if (styleSheet.sheet.insertRule) {
    styleSheet.sheet.insertRule(`${classSelector}{${rules}}`, 0);
  } else if (styleSheet.styleSheet) {
    styleSheet.styleSheet.addRule(classSelector, rules);
  } else if (styleSheet.sheet) {
    styleSheet.sheet.addRule(classSelector, rules);
  }
}
