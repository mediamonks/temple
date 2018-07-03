export default class EventDispatcher {
  _events = {};

  dispatchEvent(name, ...args) {
    if (this._events[name]) {
      let events = this._events[name];
      let length = events.length;
      for (let i = 0; i < length; i++) {
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
