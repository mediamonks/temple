import Core from '../../Core';
import loadScript from '../../util/loadScript';

export default class DoubleClick extends Core {
  constructor() {
    super();
    this.defaultExitURL = '';
    this.exitURLs = [''];

    temple.color = '#338e43';
    temple.type = 'DoubleClick';
    temple.utils.tracker = this._tracker;

    this._platform = {
      _closeOverlay: function() {
        Enabler.close();
      },
    };

    if (typeof Enabler == 'undefined') {
      loadScript('https://s0.2mdn.net/ads/studio/Enabler.js', this._initCore.bind(this));
    } else {
      this._initCore();
    }
  }

  setVideoTracking(player) {
    if (!studio.video) {
      Enabler.loadModule(
        studio.module.ModuleId.VIDEO,
        function() {
          this.setVideoTracking(player);
        }.bind(this)
      );
      return;
    }
    if (player.playHistory) {
      studio.video.Reporter.detach(player.playHistory[player.playHistory.length - 1].id);
      studio.video.Reporter.attach(player.currentVideo.id, player._video);
    } else {
      studio.video.Reporter.attach(player.currentVideo.id, player._video);
    }
  }

  exit(url) {
    url = temple.utils.validURL(url) ? url : null;
    this.dispatchEvent(temple.events.EXIT, url || this.defaultExitURL);
    Enabler.exit('Default Exit', url || this.defaultExitURL);
  }

  // private

  _pageReady() {
    temple.isLive = Enabler.isServingInLiveEnvironment();
    if (typeof Enabler != 'undefined') {
      if (Enabler.isInitialized()) this._pageLoaded();
      else Enabler.addEventListener(studio.events.StudioEvent.INIT, this._pageLoaded.bind(this));
    } else {
      setTimeout(this.init.bind(this), 50);
    }
  }

  _pageLoaded() {
    if (Enabler.isPageLoaded()) this._bannerInit();
    else Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this._bannerInit.bind(this));
  }

  _tracker(title, repeat) {
    if (studio.video) return;
    if (repeat == undefined) repeat = true;
    this._trackedEvents = this._trackedEvents || [];
    if (this._trackedEvents.length > 19) return;
    if (repeat === false && this._trackedEvents.indexOf(title) >= 0) return;
    if (this._trackedEvents.indexOf(title) == -1) {
      this._trackedEvents.push(title);
    }
    Enabler.counter(title, repeat);
    temple.utils.debug('Tracked Event: ' + (this._trackedEvents.indexOf(title) + 1) + ' - ' + title, 'green');
  }

  _addExitEvents() {
    Enabler.addEventListener(studio.events.StudioEvent.EXIT, this.onExit.bind(this));
  }
}

/**
 * The platform class for DoubleClick creatives. Handlers initial DoubleClick enabler setups and overrides the temple.tracker method with DoubleClick specific tracking api calls.
 *
 * @class Platform
 * @extends temple.core.Core
 * @namespace temple.platforms.doubleclick
 * @module Platforms
 * @constructor
 */

/**
 * Default exit url. Often defined in dynamic creatives.
 * @property defaultExitURL
 * @type {String}
 */

/**
 * Reference to the creative config json.
 * @property config
 * @type {Object}
 */
