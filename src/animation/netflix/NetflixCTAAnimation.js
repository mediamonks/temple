import AbstractAnimation from '../AbstractAnimation';

export default class NetflixCTAAnimation extends AbstractAnimation {
  getTransitionIn(complete = () => {}) {
    const tl = new TimelineLite();
    tl.call(() => this.show());
    tl.from(this.element, 1, { width: 0 });
    return tl;
  }

  getTransitionOut(complete = () => {}) {
    const tl = new TimelineLite();
    tl.from(this.element, 1, { width: 0 });
    tl.call(() => this.hide());
    tl.call(complete);
    return tl;
  }
}
