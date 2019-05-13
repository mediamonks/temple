import AbstractAnimation from '../AbstractAnimation';

export default class NetflixBrandLogoAnimation extends AbstractAnimation {
  constructor(element) {
    super(element);
    TweenLite.set(this.element, { autoAlpha: 0 });
    this.show();
  }

  /**
   * Returns transition in animation
   * @param {Function} complete
   * @return {TimelineLite}
   */
  getTransitionIn(complete = () => {}) {
    const tl = new TimelineLite();
    tl.to(this.element, 0.8, { autoAlpha: 1 });
    tl.call(() => {
      this.show();
      // this.element.progress(0);
      this.element.timeline.reversed(false);
      this.element.timeline.play();
    });
    // tl.call(() => this.element.play())
    tl.call(() => {}, [], null, this.element.animDuration);
    tl.call(() => complete);
    return tl;
  }

  /**
   * Returns transition out animation
   * @param {Function} complete
   * @return {TimelineLite}
   */
  getTransitionOut(complete = () => {}) {
    const tl = new TimelineLite();
    tl.call(() => {
      this.element.progress(1);
      this.element.timeline.reversed(true);
    });
    // tl.call(() => this.element.play())
    tl.call(() => {}, [], null, this.element.animDuration);
    tl.call(() => complete);
    return tl;
  }

  getTransitionInDuration() {
    return this.element.animDuration;
  }

  getTransitionOutDuration() {
    return this.element.animDuration;
  }
}
