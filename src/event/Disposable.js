/**
 *
 */
export default class Disposable {
  /**
   *
   * @param {string} name
   * @param {Function} func
   * @param {EventDispatcher} dispatcher
   */
  constructor(name, func, dispatcher) {
    this._name = name;
    this._func = func;
    this._dispatcher = dispatcher;
  }

  dispose() {
    this._dispatcher.removeEventListener(this._name, this._func);
    this._dispatcher = this._name = this._func = null;
  }
}
