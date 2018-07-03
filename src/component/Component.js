export default class Component {
  static requires = [];

  init() {
    console.log(Component.requires);

    return Promise.resolve();
  }

  /**
   * @description When component is added to the entity
   */
  onAdded() {}

  /**
   * @description When all the components are added and the entity is initialized
   */
  onStart() {}

  /**
   * @description When the component is removed from the entity
   */
  onRemoved() {}

  /**
   *
   * @param {Entity} entityInstance
   */
  setEntity(entityInstance) {
    this._entity = entityInstance;
  }

  /**
   *
   * @return {Entity|*}
   */
  getEntity() {
    return this._entity;
  }

  /**
   *
   * @param {Component|string|Component.constructor} component
   * @return {Component|*}
   */
  getComponent(component) {
    return this._entity.getComponent(component);
  }

  /**
   *
   * @param {Component|string|Component.constructor} component
   * @return {Component|*}
   */
  hasComponent(component) {
    return this._entity.getComponent(component) !== undefined;
  }
}
