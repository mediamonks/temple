/**
 * A Entity
 */
import DoubleClickPlatform from './event/DoubleClickPlatform';
import inlineSvg from './util/inlineSvg';
import untilEnablerIsInitialized from './util/doubleclick/untilEnablerIsInitialized';

export default class DoubleClickBanner {
  /**
   *
   * @param {HTMLElement} container
   */
  constructor() {
  }

  /**
   * This will be called by double click when its ready
   * @return {Promise<void>}
   */
  async init() {
    await untilEnablerIsInitialized();

  }

}
