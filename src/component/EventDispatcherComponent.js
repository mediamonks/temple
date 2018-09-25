import Component from './Component';

class Listener {
  constructor(scope, type, callback) {
    this.type = type;
    this.callback = callback;
  }
}

/**
 * EventDispatcherComponent is a eventDispatcher composed in a component.
 * is required by DoubleClickPlatformComponent
 *
 */
export default class EventDispatcherComponent extends Component {
  _events = [];
  /**
   *
   * @param {string} type
   * @param {function} fn
   */
  addEventListener(type, func) {
    if (!func || typeof func !== 'function') {
      throw new Error('second argument is required and needs to be a function');
    }

    const listener = new Listener(this, type, func);
    this._events.push(listener);

    return listener;
  }

  /**
   * Will remove your listener
   * @param type
   * @param fn
   */
  removeEventListener(type, func) {
    if (!func || typeof func !== 'function') {
      throw new Error('second argument is required and needs to be a function');
    }
    this._events = this._events.filter(item => item.type === type && item.callback === func);
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
