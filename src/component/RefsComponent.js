import Component from './Component';
import ElementComponent from './ElementComponent';

export default class RefsComponent extends Component {
  refs = {};

  constructor() {
    super();
  }

  onStart() {
    const element = this.getComponent(ElementComponent).get();
    const refs = this.refs;
    const elements = element.querySelectorAll('[ref]');

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const name = element.getAttribute('ref');

      if (!refs[name]) {
        refs[name] = [];
      }

      refs[name].push(element);
    }
  }

  get() {
    return this.refs;
  }
}
