import config from "richmediarc";
import untilEnablerIsInitialized from '@mediamonks/temple/util/doubleclick/untilEnablerIsInitialized';
import getEventDispatcher from '@mediamonks/temple/util/doubleclick/getEventDispatcher';
import Events from '@mediamonks/temple/event/Events';

class Banner{

  config = config;
  /**
   *
   * @param {HTMLElement} container
   * @param {FrameAnimation} animation
   */
  constructor (container, animation)
  {
    this.container = container;
    this.animation = animation;
  }

  // function is called by INIT from studio.events.StudioEvent.INIT
  async init(){

    // waits until Enabler is initialized.
    await untilEnablerIsInitialized();

    const eventDispatcher = await getEventDispatcher();
    eventDispatcher.addEventListener(Events.VISIBLE, () => {
      // do something when banner is visible.
    })
  }

  async start(){
    await this.init();

    this.animation.play();
  }
}

export default Banner;
