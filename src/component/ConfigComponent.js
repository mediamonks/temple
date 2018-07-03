import Component from './Component';

export default class ConfigComponent extends Component {
  constructor(config) {
    super();

    this._config = config;
  }

  getConfig() {
    return this._config;
  }
}
