import Component from './Component';
import ElementComponent from './ElementComponent';
import Entity from '../Entity';
import VideoComponent from './VideoComponent';

export default class AutoEntityComponent extends Component {
  constructor() {
    super();
  }

  onStart() {
    const element = this.getComponent(ElementComponent).get();

    const elements = element.querySelectorAll('[entity]');
    const rootEntity = this.getEntity();

    for (let i = 0; i < elements.length; i++) {
      const entity = new Entity(elements[i].getAttribute('entity'));
      entity.addComponent(new ElementComponent(elements[i]));

      switch (elements[i].tagName.toLowerCase()) {
        case 'video': {
          entity.addComponent(new VideoComponent());
          break;
        }
      }

      rootEntity.addChild(entity);
    }
  }
}
