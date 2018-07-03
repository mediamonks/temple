import Core from '../../Core';

export default class Sizmek extends Core {
  constructor() {
    super();
    this.defaultExitURL = '';
    this.exitURLs = [''];

    temple.color = '#0068ff';
    temple.type = 'Sizmek';
    temple.utils.tracker = this._tracker;

    this._platform = {
      _closeOverlay: function() {},
    };

    if (!window['EBG']) {
      temple.utils.loadScript('//secure-ds.serving-sys.com/BurstingScript/EBLoader.js', this._initCore.bind(this));
    } else {
      this._initCore();
    }
  }

  exit(type) {
    this.dispatchEvent(temple.events.EXIT);
    EB.clickthrough(type || this.defaultExitURL);
  }

  //private

  _pageReady() {
    if (!(EB.isInitialized() && EB._isLocalMode)) {
      temple.utils.debug('initing online');
      EB.addEventListener(EBG.EventName.EB_INITIALIZED, this._pageLoaded.bind(this));
    } else {
      temple.utils.debug('initing local');
      this._pageLoaded();
    }
  }

  _pageLoaded() {
    this._bannerInit();
  }

  _tracker(title, repeat) {
    if (repeat == undefined) repeat = true;
    this._trackedEvents = this._trackedEvents || [];
    if (this._trackedEvents.length > 19) return;
    if (repeat === false && this._trackedEvents.indexOf(title) >= 0) return;
    if (this._trackedEvents.indexOf(title) == -1) {
      this._trackedEvents.push(title);
    }
    // dhtml.sendEvent(this._trackedEvents.indexOf(title) + 1, title);
    temple.utils.debug('Tracked Event: ' + (this._trackedEvents.indexOf(title) + 1) + ' - ' + title, 'green');
  }
}

/**
 * The platform class for Sizmek creatives. Handlers initial Sizmek enabler setups and overrides the temple.tracker method with Sizmek specific tracking api calls.
 *
 * @class Platform
 * @extends temple.core.Core
 * @namespace temple.platforms.sizmek
 * @module Platforms
 * @constructor
 */
