import Component from './Component';
import ElementComponent from './ElementComponent';

export default class VideoComponent extends Component {
  constructor() {
    super();
  }

  onStart() {
    const element = this.getComponent(ElementComponent);

  }


}
