import AbstractAnimation from '../AbstractAnimation';

export default class NetflixBrandLogoAnimation extends AbstractAnimation {
  constructor(element) {
    super(element);
    this.show();
  }

  /**
   * Will return the transition Timeline
   * @return {TimelineLite}
   */
  getTransitionIn(complete = () => {}) {
    const tl = new TimelineLite();
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
   * Will return the transition Timeline
   * @return {TimelineLite}
   */
  getTransitionOut(complete = () => {}) {
    console.log('getTransitionOut');

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
