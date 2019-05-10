import uuid from './util/uuid';
import Component from './component/Component';

/**
 * A Entity
 */
export default class Entity {
  /**
   * Components, you can only add one component of the same type
   *
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

  /**
   * Specify the name of the component
   * @param {string} name
   */
  constructor(name = '') {
    this.name = name;
  }

  /**
   * Will initialize all the added components.
   * @return {Promise<any>}
   */
  init() {
    return new Promise((resolve, reject) => {
      const result = Object.values(this._components)
        .map(component => {
          const initResponse = component.init();

          if (initResponse instanceof Promise) {
            return initResponse;
          }

          return null;
        })
        .filter(value => !!value);

      Promise.all(result)
        .then(data => {
          const components = Object.values(this._components);

          // checking if all components have all required components
          if (components.every(component => component.hasRequiredComponents(true))) {
            components.forEach(component => {
              component.onStart();
            });
            resolve(data);
          } else {
            reject(new Error('components are missing required components'));
          }
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
      console.warn(`Already have a component ${component.constructor.name} added to this Entity`);
    }

    this._components[component.constructor.name] = component;
    component.setEntity(this);
    component.onAdded();
  }

  /**
   * @template T
   * @return {T}
   */
  getComponent(component) {
    let name = '';

    if (typeof component === 'string') {
      name = component;
    } else {
      ({ name } = component);
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
      ({ name } = component);
    }

    if (this._components[name]) {
      this._components[name].onRemoved();
      this._components[name] = null;
    }
  }

  /**
   * You can add a child entity
   * @param {Entity} entity
   */
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
   * @param {Entity} entity
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
   * @param {string} name
   * @return {Entity[]}
   */
  findByName(name) {
    return this._children.filter(entity => entity.name === name);
  }

  destruct() {}
}
