import traverseObject from './traverseObject';
import EventDispatcher from '../event/EventDispatcher';

/**
 *
 * @param obj
 * @returns {{observable: any, dispatcher: EventDispatcher}}
 */
function makeObservable(obj) {
  const observable = JSON.parse(JSON.stringify(obj));
  const dispatcher = new EventDispatcher();

  traverseObject(observable, (leafValue, leafName, source, traversedPath) => {
    Object.defineProperty(source, leafName, {
      value: leafName,
      set: function(v) {
        const oldValue = this[`@private__${leafName}`];
        this[`@private__${leafName}`] = v;
        dispatcher.dispatchEvent(traversedPath.join('.'), v, oldValue);
      },
      get: function() {
        return this[`@private__${leafName}`];
      },
    });
  });

  return { observable, dispatcher };
}

export default makeObservable;
