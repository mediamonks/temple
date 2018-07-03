import Core from '../Core';

export default class StandardBanner extends Core {
  show(autoplay) {
    if (this.config.video)
      if (this.config.video.autoplay && !autoplay) {
        this.dispatchEvent(temple.events.VideoEvents.AUTOPLAY);
        this.videoController
          .getSource(0)
          .addEventListener(temple.events.VideoEvents.COMPLETE, this.onShow.bind(this), false);
        this.videoController
          .getSource(0)
          .addEventListener(temple.events.VideoEvents.CLOSE, this.onShow.bind(this), false);
        return;
      }
    if (temple.isBackup) {
      this.onBackupImage();
    }

    this.banner.classList.remove('hide');

    if (this.config.video) if (!this.config.video.autoplay) this.onShow();
    if (!this.config.video) this.onShow();

    this.dispatchEvent(temple.events.SHOW);

    if (temple.isBackup) {
      alert('{"phantom":"phantom-backup"}');
    }

    if (this.config.ytmh) {
      temple.utils.createStyle('#ytClose', 'z-index: 20;');

      if (this.config.ytmh.impression.length) {
        this.Impression_Pixel_URL = this.Impression_Pixel_URL || this.config.ytmh.impression;
      }

      if (this.config.ytmh.retargeting.length) {
        this.Click_Pixel_URL = this.Click_Pixel_URL || this.config.ytmh.retargeting;
      }

      if (this.Impression_Pixel_URL.length) {
        temple.utils.debug('Impression Pixel tracked | ' + this.Impression_Pixel_URL, 'blue');
        temple.utils.loadImage(this.Impression_Pixel_URL);
      }

      if (this.Click_Pixel_URL.length) {
        this.addEventListener(
          temple.events.EXIT,
          function() {
            temple.utils.debug('Retargeting Pixel tracked | ' + this.Click_Pixel_URL, 'blue');
            temple.utils.loadImage(this.Click_Pixel_URL);
          }.bind(this)
        );
      }
    }
  }

  onBannerClick() {
    this.exit();
  }

  onShow() {}

  onTabChange() {}

  onBackupImage() {}

  onExit() {}

  onOver(e) {}

  onOut(e) {}

  init(e) {}

  // private

  _bannerInit() {
    super._bannerInit(this);
    this._ready();
  }

  _ready() {
    this.banner = document.getElementById('banner');
    this.bannerClick = document.querySelectorAll('.bannerClick');

    for (i = 0; i < this.bannerClick.length; i++) {
      this.bannerClick[i].addEventListener('click', this.onBannerClick.bind(this));
      this.bannerClick[i].addEventListener('mouseover', this.onOver.bind(this));
      this.bannerClick[i].addEventListener('mouseleave', this.onOut.bind(this));
    }

    this._addTabEvents();

    if (this._addExitEvents) this._addExitEvents();
    else this.addEventListener(temple.events.EXIT, this.onExit.bind(this));

    this._politeLoads(function() {
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && !window.innerHeight) {
        window.onresize = function() {
          if (!temple.isVisible) {
            temple.isVisible = true;
            window.onresize = null;
            this.dispatchEvent(temple.events.READY);
            this.init();
          }
        }.bind(this);

        if (!temple.isVisible) return;
      }
      this.dispatchEvent(temple.events.READY);
      this.init();
    });
  }

  _addTabEvents() {
    this._isHidden = false;
    if ('hidden' in document) {
      document.addEventListener('visibilitychange', this.onTabChange.bind(this));
    } else if ((this._isHidden = 'mozHidden') in document) {
      document.addEventListener('mozvisibilitychange', this.onTabChange.bind(this));
    } else if ((this._isHidden = 'webkitHidden') in document) {
      document.addEventListener('webkitvisibilitychange', this.onTabChange.bind(this));
    } else if ((this._isHidden = 'msHidden') in document) {
      document.addEventListener('msvisibilitychange', this.onTabChange.bind(this));
    } else if ('onfocusin' in document) {
      document.onfocusin = document.onfocusout = this.onTabChange.bind(this);
    } else {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this.onTabChange.bind(this);
    }
  }
}

////// DOCS

/**
 * The basic banner template.
 *
 * @class StandardBanner
 * @extends temple.core.Core
 * @module Templates
 * @namespace temple.templates
 * @constructor
 */

/**
 * Reference to the main banner element.
 * @property banner
 * @type {HTMLElement}
 */

/**
 * When the backup image creation task is run from the build system, this boolean is set to true. You can use this boolean in your code to setup fallbacks for backup image creation.
 * @property isBackup
 * @type {Boolean}
 */

/**
 * Calling this method will show the banner in your browser.
 *
 * @method show
 */

/**
 * The onShow is triggered right after the show method is called.
 *
 * @method onShow
 */

/**
 * Click event handler for all bannerClick elements. You can extend or override this method in your main.js.
 *
 * @method onBannerClick
 */

/**
 * Event handler that is triggered when you change tabs in your browser. You can extend or override this method in your main.js.
 *
 * @method onTabChange
 */

/**
 * Event handler that is triggered when the build system is creating backup images. You can extend or override this method in your main.js.
 * Populate this method with functions that set the creative up for backup image creation, ie. stop all animations, revert to end frame, remove close buttons, disable videos etc.
 *
 * @method onBackupImage
 */

/**
 * Event handler that is triggered when an exit is triggered. You can extend or override this method in your main.js.
 *
 * @method onExit
 */

/**
 * Event handler that is triggered when you mouse over any bannerClick element. You can extend or override this method in your main.js.
 *
 * @method onOver
 */

/**
 * Event handler that is triggered when you mouse over any bannerClick element. You can extend or override this method in your main.js.
 *
 * @method onOut
 */

/**
 * The init method is triggerd when the backend core has loaded all dependencies and the page is ready to display the banner.
 * Override this method in your main.js and include all your initialization code prior to calling the show() method.
 *
 * @method init
 */

/**
 * SHOW event is dispatched when the this.show() method is called.
 *
 * @event temple.events.SHOW
 */

/**
 * READY event is dispatched when the template is ready, prior to the init() method.
 *
 * @event temple.events.READY
 */

/**
 * AUTOPLAY event is dispatched specifically when the video module is used and autoplay is set to true.
 * This makes sure that the banner only gets shown when the video actually starts playing, to prevent a black buffering frame.
 *
 * @event temple.events.VideoEvents.AUTOPLAY
 */
