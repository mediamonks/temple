import Component from './Component';
import ElementComponent from './ElementComponent';

export default class RefsComponent extends Component {
  static requires = [ElementComponent];

  refs = {};

  onStart() {
    const element = this.getComponent(ElementComponent).get();
    const { refs } = this;
    const elements = element.querySelectorAll('[ref]');

    for (let i = 0; i < elements.length; i += 1) {
      const el = elements[i];
      const name = el.getAttribute('ref');

      if (!refs[name]) {
        refs[name] = [];
      }

      refs[name].push(el);
    }
  }

  get() {
    return this.refs;
  }
}
