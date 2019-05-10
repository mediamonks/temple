import AbstractAnimation from './AbstractAnimation';

export default class DefaultStaggerAnimation extends AbstractAnimation {
  getTransitionIn(complete = () => {}) {
    const tl = new TimelineLite();
    tl.call(() => this.show());
    tl.staggerFromTo(this.element, 1, { y: '+=20', opacity: 0 }, { y: '-=20', opacity: 1 }, 0.2);
    tl.call(complete);
    return tl;
  }

  getTransitionOut(complete = () => {}) {
    const tl = new TimelineLite();
    tl.staggerTo(this.element, 1, { y: '-=20', opacity: 0 }, 0.2);
    tl.call(() => this.hide());
    tl.call(complete);
    return tl;
  }
}
