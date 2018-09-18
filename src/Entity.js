import uuid from './util/uuid';
import Component from './component/Component';

/**
 * A Entity
 */
export default class Entity {
  /**
   * Components, you can only add one component of the same type
   * @type {{}}
   * @private
   */
  _components = {};

  /**
   *
   * @type {Array}
   * @private
   */
  _children = [];

  /**
   *
   * @type {Entity}
   */
  parent = null;

  /**
   * @type {string} uuid
   */
  id = uuid();

  /**
   *
   * @type {null}
   */
  name = null;

  constructor(name = null) {
    this.name = name;
  }

  init() {
    return new Promise(resolve => {
      const result = Object.values(this._components)
        .map(component => {
          const result = component.init();

          if (result instanceof Promise) {
            return result;
          }

          return null;
        })
        .filter(value => !!value);

      Promise.all(result)
        .then(data => {
          Object.values(this._components).forEach(component => component.onStart());
          resolve(data);
        })
        .catch(err => {
          console.error('err', err);
          reject(err);
        });
    });
  }

  /**
   *
   * @param {Component} component
   */
  addComponent(component) {
    if (!(component instanceof Component)) {
      throw new Error('Can only add a instance of component.');
    }

    if (this._components[component.constructor.name]) {
      debugger;
      console.warn(`Already have a component ${component.constructor.name} added to this Entity`);
    }

    this._components[component.constructor.name] = component;
    component.setEntity(this);
    component.onAdded();
  }

  /**
   *
   * @param {Component} component
   */
  getComponent(component) {
    let name = '';

    if (typeof component === 'string') {
      name = component;
    } else {
      name = component.name;
    }

    return this._components[name];
  }

  /**
   * Remove component from entity.
   * @param {Component} component
   */
  removeComponent(component) {
    let name = '';

    if (typeof component === 'string') {
      name = component;
    } else {
      name = component.name;
    }

    if (this._components[name]) {
      this._components[name].onRemoved();
      this._components[name] = null;
    }
  }

  addChild(entity) {
    if (entity === this) {
      throw new Error('cant child your self');
    }

    if (entity.parent) {
      entity.parent.removeChild(entity);
    }
    entity.parent = this;

    this._children.push(entity);
  }

  /**
   * Removes child entity from entity
   * @param entity
   */
  removeChild(entity) {
    if (entity === this) {
      throw new Error('cant child your self');
    }

    this._children = this._children.filter(item => {
      if (item !== entity) {
        return true;
      }

      entity.parent = null;

      return false;
    });
  }

  /**
   *
   * @param name
   * @return {Entity[]}
   */
  findByName(name) {
    return this._children.filter(entity => entity.name === name);
  }
}
