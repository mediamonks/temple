import DoubleClickBanner from '../../src/DoubleClickBanner';
import config from "richmediarc";

class Banner extends DoubleClickBanner {

  config = config;
  /**
   *
   * @param {HTMLElement} container
   * @param {FrameAnimation} animation
   */
  constructor (container, animation)
  {
    super(container);

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
