import AbstractAnimation from './AbstractAnimation';

/**
 * A stagger animation
 */
export default class StaggerAnimation extends AbstractAnimation {
  /**
   * Will return the transition Timeline
   * @return {TimelineLite}
   */
  getTransitionIn(complete = () => {}) {
    const tl = new TimelineLite();
    tl.call(() => this.show());
    tl.staggerFromTo(this.element, 1, { y: '+=20', opacity: 0 }, { y: '-=20', opacity: 1 }, 0.2);
    tl.call(complete);
    return tl;
  }

  /**
   * Will return the transition Timeline
   * @return {TimelineLite}
   */
  getTransitionOut(complete = () => {}) {
    const tl = new TimelineLite();
    tl.staggerTo(this.element, 1, { y: '-=20', opacity: 0 }, 0.2);
    tl.call(() => this.hide());
    tl.call(complete);
    return tl;
  }
}
