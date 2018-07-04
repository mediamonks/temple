import Component from './Component';
import ElementComponent from './ElementComponent';
import * as ko from '../vendor/knockout/knockout.1.3';

export default class KnockoutComponent extends Component {
  constructor(bindings = {}) {
    super();
    this.bindings = bindings;
  }

  onStart() {
    const element = this.getComponent(ElementComponent).get();

    ko.applyBindings(this.bindings, element);
  }

}
