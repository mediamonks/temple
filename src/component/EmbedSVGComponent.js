import Component from './Component';
import ElementComponent from './ElementComponent';
import loadText from '../util/loadText';

/**
 * @description embeds svgComponent
 */
export default class EmbedSVGComponent extends Component {
  static requires = [ElementComponent];

  init() {
    return super.init().then(() => {
      const element = this.getComponent(ElementComponent).get();
      const elements = Array.from(element.querySelectorAll('[svg]'));

      elements.forEach(img => {
        if (!img.src) {
          throw new Error('Missing src attribute');
        }
      });

      return Promise.all(elements.map(img => loadText(img.src))).then(svgList => {
        svgList.forEach((svgText, index) => {
          const el = elements[index];
          const { id, className } = el;
          const div = document.createElement('div');
          const parent = el.parentNode;

          parent.appendChild(div);
          div.innerHTML = svgList[index];
          div.firstChild.id = id;
          div.firstChild.setAttribute('class', className);

          parent.replaceChild(div.firstChild, el);
          parent.removeChild(div);
        });
      });
    });
  }

  onStart() {}
}
