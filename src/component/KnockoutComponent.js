import Component from './Component';
import ElementComponent from './ElementComponent';
import ko from '../vendor/knockout/knockout.1.3';

/**
 * KnockoutComponent will add knockout functionality to a entity.
 */
export default class KnockoutComponent extends Component {
  static requires = [ElementComponent];

  constructor(bindings = {}) {
    super();
    this.bindings = bindings;
  }

  onStart() {
    const element = this.getComponent(ElementComponent).get();
    ko.applyBindings(this.bindings, element);
  }
}
