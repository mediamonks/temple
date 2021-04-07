/**
 * A Entity
 */
import DoubleClickPlatform from './event/DoubleClickPlatform';
import inlineSvg from './util/inlineSvg';

export default class DoubleClickBanner {
  _platform = new DoubleClickPlatform();
  _dispose = [];

  /**
   *
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._dispose.push(
      this._platform.addEventListener(DoubleClickPlatform.INIT, () => this.init()),
    );
    this.container = container;
  }

  /**
   * This will be called by double click when its ready
   * @return {Promise<void>}
   */
  async init() {
    // will inline svg elements with attribute svg or inline
    await inlineSvg(this.container);
  }

  destruct() {
    // removes all event listeners
    this._dispose.forEach(disposable => disposable.dispose());
  }
}
