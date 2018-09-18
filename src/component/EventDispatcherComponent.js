import Component from './Component';

class Listener {
  constructor(scope, type, callback) {
    this.type = type;
    this.callback = callback;
  }
}

/**
 *
 */
export default class EventDispatcherComponent extends Component {
  _events = [];
  /**
   *
   * @param {string} type
   * @param {function} fn
   */
  addlistener(type, fn) {
    this._events.push(new Listener(this, type, fn));
  }

  /**
   * Will remove your listener
   * @param type
   * @param fn
   */
  removelistener(type, fn) {
    this._events = this._events.filter(item => item.type === type && item.callback === fn);
  }

  /**
   *
   * @param {string} type
   * @param {any} args
   */
  dispatch(type, ...args) {
    this._events.forEach(item => {
      if (item.type === type) {
        item.callback.apply(this, args);
      }
    });
  }
}
