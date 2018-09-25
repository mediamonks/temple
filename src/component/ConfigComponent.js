import Component from './Component';

export default class ConfigComponent extends Component {
  constructor(config) {
    super();

    this._config = config;
  }

  get() {
    return this._config;
  }
}
