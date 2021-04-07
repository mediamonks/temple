/**
 *
 */
import Disposable from './Disposable';

export default class EventDispatcher {
  _events = {};

  /**
   *
   * @param {string} name
   * @param {Array<any>>} args
   */
  dispatchEvent(name, ...args) {
    if (this._events[name]) {
      const events = this._events[name];
      const { length } = events;
      for (let i = 0; i < length; i += 1) {
        const func = events[i];
        func.apply(this, args);
      }
    }
  }

  /**
   *
   * @param {string} name
   * @param {function} func
   */
  addEventListener(name, func) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(func);

    return new Disposable(name, func, this);
  }

  /**
   *
   * @param {string} event
   * @param {func} func
   */
  removeEventListener(event, func) {
    if (!func || typeof func !== 'function') {
      throw new Error('second argument is required and needs to be a function');
    }

    if (this._events[event]) {
      this._events[event] = this._events[event].filter(value => value !== func);
    }
  }
}
