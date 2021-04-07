import loadScript from '../util/loadScript';
import getEnabler from '../util/getEnabler';
import EventDispatcher from './EventDispatcher';

export default class DoubleClickPlatform extends EventDispatcher {
  static INIT = 'DoubleClickPlatformComponent.INIT';
  static EXIT = 'DoubleClickPlatformComponent.EXIT';
  static VISIBLE = 'DoubleClickPlatformComponent.VISIBLE';
  static EXPAND_START = 'DoubleClickPlatformComponent.EXPAND_START';
  static EXPAND_FINISH = 'DoubleClickPlatformComponent.EXPAND_FINISH';
  static COLLAPSE = 'DoubleClickPlatformComponent.COLLAPSE';
  static COLLAPSE_START = 'DoubleClickPlatformComponent.COLLAPSE_START';
  static COLLAPSE_FINISH = 'DoubleClickPlatformComponent.COLLAPSE_FINISH';
  static FULLSCREEN_EXPAND_START = 'DoubleClickPlatformComponent.FULLSCREEN_EXPAND_START';
  static FULLSCREEN_EXPAND_FINISH = 'DoubleClickPlatformComponent.FULLSCREEN_EXPAND_FINISH';
  static FULLSCREEN_COLLAPSE_START = 'DoubleClickPlatformComponent.FULLSCREEN_COLLAPSE_START';
  static FULLSCREEN_COLLAPSE_FINISH = 'DoubleClickPlatformComponent.FULLSCREEN_COLLAPSE_FINISH';
  static HIDDEN = 'DoubleClickPlatformComponent.HIDDEN';
  static INTERACTION = 'DoubleClickPlatformComponent.INTERACTION';
  static ORIENTATION = 'DoubleClickPlatformComponent.ORIENTATION';
  static PAGE_LOADED = 'DoubleClickPlatformComponent.PAGE_LOADED';

  _init = null;

  constructor(autoInit = true) {
    super();

    if (autoInit) {
      this.init();
    }
  }

  /**
   *
   * @return {null}
   */
  init() {
    if (this._init) {
      this._init = getEnabler()
        .then(Enabler => {
          return new Promise(resolve => {
            if (!Enabler.isInitialized()) {
              Enabler.addEventListener(studio.events.StudioEvent.INIT, resolve);
            } else {
              resolve();
            }
          });
        })
        .then(() => {
          this.queryFullscreenDimensions();
          this.queryFullscreenSupport();

          this.setupEvents();

          this.handleInit();
        });
    }

    return this._init;
  }

  async loadEnabler() {
    if (!window.Enabler) {
      await loadScript('https://s0.2mdn.net/ads/studio/Enabler.js');
    }

    return getEnabler();
  }

  setupEvents() {
    const e = window.Enabler;
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

  /**
   * Indicates the maximum dimensions available to the creative for fullscreen expansion, as
   * well as the offset of the original creative.
   *
   * If width and height are zero, it means the ad cannot expand to fullscreen. (note that in these
   * circumstances, any studio.events.FULLSCREEN_SUPPORT events will have "supported" set to false).
   * If width and height are not present, it means display width and height cannot be determined in
   * the current ad rendering environment (for example, MRAID 1.0). If left and top are -1, it means
   * that the location of the ad could not be determined.
   *
   * @return {Promise<{width, height, top, left}>}
   */
  queryFullscreenDimensions() {
    if (!this._queryFullscreenDimensionsPromise) {
      this._queryFullscreenDimensionsPromise = new Promise(resolve => {
        const fn = data => {
          window.Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fn);
          resolve(data);
        };
        window.Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fn);
      });
    }

    return this._queryFullscreenDimensionsPromise;
  }

  /**
   * inform the creative as to whether fullscreen is supported.
   *
   * @return {Promise<boolean>}
   */
  queryFullscreenSupport() {
    if (!this._queryFullscreenSupportPromise) {
      this._queryFullscreenSupportPromise = new Promise(resolve => {
        const fn = data => {
          Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fn);
          resolve(data);
        };
        Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fn);
      });
    }

    return this._queryFullscreenSupportPromise;
  }

  /**
   * Dispatched when an exit is invoked.
   */
  handleExit = () => {
    this.dispatchEvent(DoubleClickPlatform.EXIT);
  };

  handleInit = () => {
    this.dispatchEvent(DoubleClickPlatform.INIT);
  };

  handleVisible = () => {
    this.dispatchEvent(DoubleClickPlatform.VISIBLE);
  };

  /**
   * Dispatched when the creative has begun expanding. This gets dispatched when a user calls
   * studio.Enabler#requestExpand() or when the rendering environment has initiated expanding the creative.
   */
  handleExpandStart = () => {
    this.dispatchEvent(DoubleClickPlatform.EXPAND_START);
  };

  /**
   * Dispatched when the creative has finished expanding.
   */
  handleExpandFinish = () => {
    this.dispatchEvent(DoubleClickPlatform.EXPAND_FINISH);
  };

  handleCollapse = () => {
    this.dispatchEvent(DoubleClickPlatform.COLLAPSE);
  };

  handleCollapseStart = () => {
    this.dispatchEvent(DoubleClickPlatform.COLLAPSE_START);
  };

  /**
   * Dispatched when the ad is hidden from the user. This is useful for environments where the
   * ad is rendered offscreen and displayed to the user at a later time, then possibly hidden.
   */
  handleHidden = () => {
    this.dispatchEvent(DoubleClickPlatform.HIDDEN);
  };

  /**
   * Dispatched when an interaction occurs.
   */
  handleInteraction = () => {
    this.dispatchEvent(DoubleClickPlatform.INTERACTION);
  };

  /**
   * Dispatched when orientation and/or orientation degrees change.
   */
  handleOrientation = () => {
    this.dispatchEvent(DoubleClickPlatform.ORIENTATION);
  };

  handlePageLoaded = () => {
    this.dispatchEvent(DoubleClickPlatform.PAGE_LOADED);
  };

  /**
   * Dispatched when the creative should begin collapsing. This gets dispatched when a user
   * calls studio.Enabler#requestCollapse() or when the rendering environment has started to collapsed the creative
   */
  handleCollapseFinish = () => {
    this.dispatchEvent(DoubleClickPlatform.COLLAPSE_FINISH);
  };

  handleFullscreenExpandStart = () => {
    this.dispatchEvent(DoubleClickPlatform.FULLSCREEN_EXPAND_START);
  };

  handleFullscreenExpandFinish = () => {
    this.dispatchEvent(DoubleClickPlatform.FULLSCREEN_EXPAND_FINISH);
  };

  /**
   * Dispatched when the creative should begin collapsing from fullscreen state to collapsed state.
   */
  handleFullscreenCollapseStart = () => {
    this.dispatchEvent(DoubleClickPlatform.FULLSCREEN_COLLAPSE_START);
  };

  /**
   * Dispatched when the creative has finished collapsing from fullscreen state to collapsed state.
   */
  handleFullscreenCollapseFinish = () => {
    this.dispatchEvent(DoubleClickPlatform.FULLSCREEN_COLLAPSE_FINISH);
  };
}
