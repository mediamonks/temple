import createStyle from '../util/createStyle';

export default class CtaModule extends Module {
  constructor(data, banner, id) {
    super();

    this.version = '1.0.1';
    this.banner = banner;
    this.id = id || 0;
    this.size = data.size || 40;
    this.color = data.color || ['#e50914', '#ffffff'];
    this.element = data.element || data;
    this.element.classList.add('ctaModule' + id);
    this.border = data.border || 'border: none;';
    this.isArrow = data.isArrow || false;

    if (data.textColor) {
      this.textColor = data.textColor;
    } else {
      this.textColor = this.color.slice(0);
      this.textColor.reverse();
    }

    this.cta_border = document.createElement('div');
    this.cta_border.className = 'cta_border';

    this.fill = document.createElement('div');
    this.fill.className = 'cta_fill';
    this.copy = document.createElement('div');
    this.copy.className = 'cta_copy';

    this.arrow = document.createElement('div');
    this.arrow.className = 'cta_arrow';
    this.arrow.innerHTML = '›';

    var className = '.ctaModule' + id;

    this.element.appendChild(this.fill);
    this.element.appendChild(this.copy);
    this.element.appendChild(this.arrow);
    this.element.appendChild(this.cta_border);

    if (this.isArrow) {
      createStyle(className + ' .cta_copy', 'margin-top:-2px;');
    } else {
      createStyle(className + ' .cta_copy', 'padding-right: 8px');
      createStyle(className + ' .cta_arrow', 'display: none;');
    }

    createStyle(
      className,
      'position:absolute;' +
      'background-color:' +
      this.color[0] +
      ';' +
      'color:' +
      this.textColor[0] +
      ';' +
      'font-family:"proximanova_bold";' +
      'text-align:center;' +
      'line-height:' +
      this.size +
      'px;' +
      '-webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);' /* this fixes the overflow:hidden in Chrome/Opera */ +
        'overflow: hidden;font-size:' +
        this.size +
        'px;'
    );

    createStyle(
      className + ' .cta_fill',
      'position:absolute;' +
        'width:100%;' +
        'height:100%;' +
        'top:0;' +
        'left:-100%;' +
        'background-color:' +
        this.color[1] +
        ';' +
        'border-radius:inherit'
    );

    createStyle(
      className + ' .cta_copy',
      'position:absolute;' +
        'width:100%;' +
        'left:0;' +
        'padding:4px 18px 4px 8px;' +
        'line-height:' +
        this.size +
        'px;' +
        'top:50%;'
    );

    createStyle(
      className + ' .cta_arrow',
      'position:absolute;' + 'top:50%;' + 'right:10px;' + 'font-size:16px !important;' + 'margin-top:-1px;'
    );

    createStyle(
      className + ' .cta_border',
      'position:absolute;' +
        'left:0;' +
        'top:0;' +
        'width:100%;' +
        'height:100%;' +
        'border:' +
        this.border +
        ';' +
        'border-radius:inherit'
    );

    TweenMax.set([this.copy, this.arrow], { y: '-50%' });

    if (data.dynamic) {
      this.copy.setAttribute('data-dynamic', data.dynamic);
    }

    if (data.text) {
      this.setText(data.text);
    }

    this.done();
  }

  setText(text, size) {
    this.copy.innerHTML = text;
    var s = size || this.size;
    this.copy.style.fontSize = s + 'px';
    var lh = Math.round(s + 1);
    lh = !(lh == parseFloat(lh) ? !(lh % 2) : void 0) ? lh - 1 : lh;
    this.copy.style.lineHeight = lh + 'px';

    this.currentWidth = this.element.offsetWidth;
    this.maxWidth = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('max-width'));

    if (this.copy.offsetHeight > this.element.offsetHeight) {
      while (this.copy.offsetHeight > this.element.offsetHeight && this.currentWidth <= this.maxWidth) {
        this.currentWidth += 1;
        this.element.style.width = this.currentWidth + 'px';
      }
    }

    if (this.copy.offsetHeight > this.element.offsetHeight) {
      while (this.copy.offsetHeight > this.element.offsetHeight) {
        if (this.element.offsetHeight === 0) {
          debug('ERROR CtaModule : container height = 0', 'pink');
          break;
        }

        s -= 0.2;
        this.copy.style.fontSize = s + 'px';
        var lh = Math.round(s + 1);
        lh = !(lh == parseFloat(lh) ? !(lh % 2) : void 0) ? lh + 1 : lh;
        this.copy.style.lineHeight = lh + 'px';
      }
    }
  }

  onOver() {
    TweenMax.to(this.fill, 0.5, { x: '100%', ease: Expo.easeOut, force3D: true });
    TweenMax.to([this.copy, this.arrow], 0.5, {
      color: this.textColor[1],
      ease: Expo.easeOut,
      force3D: true,
    });
  }

  onOut() {
    TweenMax.to(this.fill, 0.5, { x: '0%', ease: Expo.easeOut, force3D: true });
    TweenMax.to([this.copy, this.arrow], 0.5, {
      color: this.textColor[0],
      ease: Expo.easeOut,
      force3D: true,
    });
  }
}
