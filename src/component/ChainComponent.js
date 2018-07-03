import Component from './Component';

export default class ChainComponent extends Component {
  _currentChain = Promise.resolve(true);

  setEntity(entity) {
    super.setEntity(entity);

    entity.chain = this.chain;
  }

  chain = (func, params) => {
    this._currentChain = this._currentChain.then(() => unc.call(this._entity, params));

    return this;
  };
}
