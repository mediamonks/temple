import loadScript from '../../util/loadScript';
import PlatformComponent from './PlatformComponent';
import EventDispatcherComponent from '../EventDispatcherComponent';
import DoubleClickEventEnum from '../../event/DoubleClickEventEnum';
import getEnabler from '../../util/getEnabler';

// studio.events.StudioEvent.INIT,
// studio.events.StudioEvent.VISIBLE,
// studio.events.StudioEvent.EXPAND_START
// studio.events.StudioEvent.EXPAND_FINISH
// studio.events.StudioEvent.COLLAPSE_START
// studio.events.StudioEvent.COLLAPSE_FINISH
// studio.events.StudioEvent.FULLSCREEN_SUPPORT
// studio.events.StudioEvent.FULLSCREEN_DIMENSIONS
// studio.events.StudioEvent.FULLSCREEN_EXPAND_START
// studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH
// studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START
// studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH

export default class DoubleClickPlatformComponent extends PlatformComponent {
  static requires = [EventDispatcherComponent];

  init() {
    return super
      .init()
      .then(() => this.loadEnabler())
      .then(Enabler => {
        Enabler.addEventListener(studio.events.StudioEvent.EXIT, this.handleExit);
      });
  }

  loadEnabler() {
    return Promise.resolve(true)
      .then(() => {
        if (!Enabler) {
          return loadScript('https://s0.2mdn.net/ads/studio/Enabler.js');
        }
      })
      .then(() => getEnabler());
  }

  setupEvents() {
    const e = Enabler;
    const se = studio.events.StudioEvent;

    e.addEventListener(se.EXIT, this.handleExit);

    e.addEventListener(se.INTERACTION, this.handleInteraction);
    e.addEventListener(se.ORIENTATION, this.handleOrientation);
    e.addEventListener(se.PAGE_LOADED, this.handlePageLoaded);

    e.addEventListener(se.HIDDEN, this.handleHidden);
    e.addEventListener(se.VISIBLE, this.handleVisible);

    // expandable events
    e.addEventListener(se.COLLAPSE, this.handleCollapse);
    e.addEventListener(se.COLLAPSE_FINISH, this.handleCollapseFinish);
    e.addEventListener(se.COLLAPSE_START, this.handleCollapseStart);

    e.addEventListener(se.EXPAND_FINISH, this.handleExpandFinish);
    e.addEventListener(se.EXPAND_START, this.handleExpandStart);

    e.addEventListener(se.FULLSCREEN_COLLAPSE_FINISH, this.handleFullscreenCollapseFinish);
    e.addEventListener(se.FULLSCREEN_COLLAPSE_START, this.handleFullscreenCollapseStart);
    e.addEventListener(se.FULLSCREEN_EXPAND_FINISH, this.handleFullscreenExpandFinish);
    e.addEventListener(se.FULLSCREEN_EXPAND_START, this.handleFullscreenExpandStart);
  }

  /**
   *
   * @param {string} id
   * @param {HTMLVideoElement} videoElement
   */
  addVideoTracking(id, videoElement) {
    if (!studio.video) {
      Enabler.loadModule(studio.module.ModuleId.VIDEO, () => {
        this.addVideoTracking(id, videoElement);
      });
      return;
    }

    studio.video.Reporter.attach(id, videoElement);
  }

  queryFullscreenDimensions() {
    return new Promise(resolve => {
      const fn = data => {
        Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fn);
        resolve(data);
      };
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fn);
    });
  }

  /**
   * Indicates the maximum dimensions available to the creative for
   * fullscreen expansion, as well as the offset of the original creative.
   *
   * @return {Promise<boolean>}
   */
  queryFullscreenDimensions() {
    return new Promise(resolve => {
      const fn = data => {
        Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fn);
        resolve(data);
      };
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fn);
    });
  }

  /**
   * Dispatched when an exit is invoked.
   */
  handleExit = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_EXIT);
  };

  handleInit = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_INIT);
  };

  handleVisible = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_VISIBLE);
  };

  /**
   * Dispatched when the creative has begun expanding. This gets dispatched when a user calls
   * studio.Enabler#requestExpand() or when the rendering environment has initiated expanding the creative.
   */
  handleExpandStart = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_EXPAND_START);
  };

  /**
   * Dispatched when the creative has finished expanding.
   */
  handleExpandFinish = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_EXPAND_FINISH);
  };

  handleCollapse = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_COLLAPSE);
  };

  handleCollapseStart = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_COLLAPSE_START);
  };

  /**
   * Dispatched when the ad is hidden from the user. This is useful for environments where the
   * ad is rendered offscreen and displayed to the user at a later time, then possibly hidden.
   */
  handleHidden = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_HIDDEN);
  };

  /**
   * Dispatched when an interaction occurs.
   */
  handleInteraction = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_INTERACTION);
  };

  /**
   * Dispatched when orientation and/or orientation degrees change.
   */
  handleOrientation = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_ORIENTATION);
  };

  handlePageLoaded = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_PAGE_LOADED);
  };

  /**
   * Dispatched when the creative should begin collapsing. This gets dispatched when a user
   * calls studio.Enabler#requestCollapse() or when the rendering environment has started to collapsed the creative
   */
  handleCollapseFinish = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_COLLAPSE_FINISH);
  };

  handleFullscreenExpandStart = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_FULLSCREEN_EXPAND_START);
  };

  handleFullscreenExpandFinish = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_FULLSCREEN_EXPAND_FINISH);
  };

  /**
   * Dispatched when the creative should begin collapsing from fullscreen state to collapsed state.
   */
  handleFullscreenCollapseStart = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_FULLSCREEN_COLLAPSE_START);
  };

  /**
   * Dispatched when the creative has finished collapsing from fullscreen state to collapsed state.
   */
  handleFullscreenCollapseFinish = () => {
    const dispatcher = this.getComponent(EventDispatcherComponent);
    dispatcher.dispatch(DoubleClickEventEnum.DC_FULLSCREEN_COLLAPSE_FINISH);
  };
}
