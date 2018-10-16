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

      return Promise.all(elements.map(img => loadText(img.src))).then(svgList => {
        svgList.forEach((svgText, index) => {
          const el = elements[index];
          const id = el.id;
          const div = document.createElement('div');
          const parent = el.parentNode;
          div.innerHTML = svgList[index];
          parent.appendChild(div);

          parent.replaceChild(div, el);
          div.firstChild.id = id;
        });
      });
    });
  }

  onStart() {}
}
