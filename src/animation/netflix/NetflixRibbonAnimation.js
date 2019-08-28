import AbstractAnimation from '../AbstractAnimation';

export default class NetflixRibbonAnimation extends AbstractAnimation {
  getTransitionIn(complete = () => {}) {
    this.show();
    const tl = new TimelineLite();
    tl.fromTo(
      this.element.leftContainer,
      0.2,
      { y: this.height },
      { y: 0, ease: Power2.easeIn },
      'start',
    )
      .fromTo(
        this.element.mid,
        0.2,
        { x: '-50%', y: '-150%' },
        { x: '-50%', y: '-50%', ease: Power2.easeIn },
        'start+=.2',
      )
      .fromTo(
        this.element.rightContainer,
        0.2,
        { y: this.element.height },
        { y: 0, ease: Power2.easeIn, onComplete: complete },
        'start+=.4',
      );

    return tl;
  }

  getTransitionOut(complete = () => {}) {
    const tl = new TimelineLite();
    tl.to(
      this.element.leftContainer,
      0.2,
      {
        y: -this.element.height,
        ease: Power2.easeIn,
      },
      'start',
    )
      .to(this.element.mid, 0.3, { x: '-50%', y: '200%', ease: Power2.easeIn }, 'start+=.3')
      .to(
        this.element.rightContainer,
        0.3,
        { y: -this.element.height, ease: Power2.easeIn, onComplete: complete },
        'start+=.5',
      );

    return tl;
  }
}
