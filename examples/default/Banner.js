import DoubleClickBanner from '../../src/DoubleClickBanner';

class Banner {

  /**
   *
   * @param {HTMLElement} container
   * @param {Animation} animation
   */
  constructor (container, animation)
  {
    this.animation = animation;
  }

  // function is called by INIT from studio.events.StudioEvent.INIT
  async init(){

    // this function already inlines svg img tags
    await super.init();
  }

  start(){
    this.animation.play();
  }
}

export default Banner;
