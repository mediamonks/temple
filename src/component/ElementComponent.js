import Component from './Component';

export default class ElementComponent extends Component {
  constructor(elementOrSelector) {
    super();
    this.elementOrSelector = elementOrSelector;
  }

  get() {
    if (typeof this.elementOrSelector === 'string') {
      this.elementOrSelector = document.querySelector(this.elementOrSelector);
    }

    return this.elementOrSelector;
  }

  /**
   * @deprecated
   * @return {*}
   */
  getElement = this.get;
}
