import Core from '../temple/Core';
import loadJSON from '../temple/util/loadJSON';
import isValidURL from '../temple/util/isValidURL';

export default class MonetBanner extends Core {
  constructor() {
    super();

    this.monetComponent = document.querySelector('monet-integrator');
  }

  show() {
    // <-- DEV -->
    if (document.body.classList.contains('phantom-backup')) {
      this.onBackupImage();
    }
    // <-- /DEV -->

    this.banner.classList.remove('hide');

    this.onShow();

    this.dispatchEvent(temple.events.SHOW);

    // <-- DEV -->
    if (document.body.classList.contains('phantom-backup')) {
      alert('{"phantom":"phantom-backup"}');
    }
    // <-- /DEV -->
  }

  onBannerClick() {
    if (temple.isiOS) {
      this.exit(this.monetData.rootAssets['url.Exit_URL_iOS'].url);
      return;
    }

    if (temple.isMobile) {
      this.exit(this.monetData.rootAssets['url.Exit_URL_Android'].url);
      return;
    }

    this.exit(this.monetData.rootAssets['url.Exit_URL_Desktop'].url);
  }

  onShow() {}
  onTabChange() {}
  onBackupImage() {}
  onExit() {}
  onOver(e) {}
  onOut(e) {}
  init(e) {}

  // protected

  _bannerInit() {
    _super.prototype._bannerInit(this);
    _ready.call(this);
  }

  exit(url) {
    url = temple.utils.validURL(url) ? url : null;
    this.dispatchEvent(temple.events.EXIT, url || this.defaultExitURL);
    Enabler.exitOverride('Default Exit', url || this.defaultExitURL);
  }
}

// private

function _ready() {
	this.banner = document.getElementById("banner");
	var bannerClick = document.querySelectorAll(".bannerClick");

	// <-- DEV -->
	if (document.body.classList.contains('phantom-backup')) {
		this.isBackup = true;
	}
	// <-- /DEV -->

	for (i=0; i < bannerClick.length; i++) {
		bannerClick[i].addEventListener("click", this.onBannerClick.bind(this));
		bannerClick[i].addEventListener("mouseover", this.onOver.bind(this));
		bannerClick[i].addEventListener("mouseleave", this.onOut.bind(this));
	}

	_addTabEvents.call(this);

	if (this._addExitEvents) this._addExitEvents();
	else this.addEventListener(temple.events.EXIT, this.onExit.bind(this));

	this._politeLoads( function() {
		if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && !window.innerHeight) {
			window.onresize = function() {
				if (!temple.isVisible) {
					temple.isVisible = true;
					window.onresize = null;
					_initComponent.call(this);
				}
			}.bind(this);

			if (!temple.isVisible) return;
		}
		_initComponent.call(this);
	});

}

function readyEvent() {
	_webComponentReady.call(__instance);
}

function _initComponent() {
	this.monetComponent = document.querySelector("monet-integrator");

	if (this.monetComponent.hasAttribute("ready")) {
		_webComponentReady.call(this);
	} else {
		this.monetComponent.addEventListener("ready", readyEvent);
	}
}

function _webComponentReady() {
	this.monetComponent.removeEventListener("ready", readyEvent);
	_validateMonetData.call(this).then(function(data) {
		this.monetData = data;

		function _ready() {
			_setImpressionLogging.call(this);
			this.dispatchEvent(temple.events.READY);
			this.init();
		}

		if (this.initDynamicComponents) {
			_initDynamicComponents.call(this).then(function() {
				_ready.call(this);
			}.bind(this));
		} else {
			_ready.call(this);
		}


	}.bind(this));
}

function _initDynamicComponents() {
	return new Promise(function(resolve, reject) {
		this.initDynamicComponents(resolve);
	}.bind(this));
}

function _validateMonetData() {
	return new Promise(function(resolve, reject) {
		this.monetComponent.getMonetData().then(function(data) {

			if (!data.isBackupData) {
				_getBackupMonetData.call(this).then(function(backupData) {
					for (var i in backupData.rootAssets) {
						if (!data.rootAssets[i]) {
							this.monetComponent.logEvent('MONET_DATA_VALIDATION_ERROR', {
								details: "Key `" + i + "` not found in Monet data; using backup data."
							});
							resolve(backupData);
							return;
						}
					}
					resolve(data);
				}.bind(this));
			} else {
				resolve(data);
			}
		}.bind(this));
	}.bind(this));
}

function _getBackupMonetData() {
	return new Promise(function(resolve, reject) {
		// <-- REPLACE -->
		temple.utils.loadJSON(temple.config.monet.json, function(data) {
			/* <-- /REPLACE -->
				temple.utils.loadJSON("backup.json", function(data) {
			<-- //REPLACE --> */
			resolve(data);
		}, reject)
	}.bind(this));
}

function _setImpressionLogging() {
	var impressionType = "STANDARD";
	var impressionLoggingArray = this.monetData.assetGroups.length > 1 ? ["MULTI_TITLE"] : ["SINGLE_TITLE"];
	var video = document.querySelectorAll("netflix-video");

	if (temple.config.monet.title_type) {
		impressionLoggingArray = [temple.config.monet.title_type];
	}

	if (temple.events.EXPAND) {
		impressionLoggingArray.push("EXPANDING");
	}

	if (video.length) {
		var autoplay = false;
		for (var i = 0; i < video.length; i++) {
			if (video[i].hasAttribute("autoplay")) autoplay = true;
		}
		impressionType = "RICH_MEDIA";
		impressionLoggingArray.push("VIDEO");

		if (autoplay) {
			impressionLoggingArray.push("AUTOPLAY");
		}
	}

	if (temple.config.monet.skills) {
		impressionLoggingArray = impressionLoggingArray.concat(temple.config.monet.skills);
	}

	Monet.logEvent("MONET_IMPRESSION", { "type": impressionType, "skills": impressionLoggingArray });

	this.banner.addEventListener("click", _trackMonetEvent_CLICK.bind(this));
	this.addEventListener(temple.events.EXIT, _trackMonetEvent_EXIT.bind(this));

	if (temple.config.expandable) {
		if (!this.lightboxModule) {
			this.expandingModule.addEventListener(temple.events.EXPAND, _trackMonetExpandableEvent_EXPAND.bind(this));
			this.expandingModule.addEventListener(temple.events.COLLAPSE, _trackMonetExpandableEvent_COLLAPSE.bind(this));
		} else {
			this.lightboxModule.addEventListener(temple.events.EXPAND, _trackMonetExpandableEvent_EXPAND.bind(this));
			this.lightboxModule.addEventListener(temple.events.COLLAPSE, _trackMonetExpandableEvent_COLLAPSE.bind(this));
		}
	}
}

function _trackMonetEvent_CLICK(event) {
	var t = String(event.target);
	Monet.logEvent("CLICK", { "src": t, "coords": { "x": event.clientX, "y": event.clientY } });
}

function _trackMonetEvent_EXIT(event) {
	Monet.logEvent("AD_EXIT", { "url": event.url });
}

function _trackMonetExpandableEvent_EXPAND(event) {
	Monet.logEvent("UNIT_RESIZE", { "type": "expand",
		"Size": { "width": temple.config.expandable.width, "height": temple.config.expandable.height }
	});
}

function _trackMonetExpandableEvent_COLLAPSE(event) {
	Monet.logEvent("UNIT_RESIZE", { "type": "collapse",
		"Size": { "width": temple.config.size.width, "height": temple.config.size.height }
	});
}

function _addTabEvents() {
	this._isHidden = false;
	if ("hidden" in document) {
		document.addEventListener("visibilitychange", this.onTabChange.bind(this));
	} else if ((this._isHidden = "mozHidden") in document) {
		document.addEventListener("mozvisibilitychange", this.onTabChange.bind(this));
	} else if ((this._isHidden = "webkitHidden") in document) {
		document.addEventListener("webkitvisibilitychange", this.onTabChange.bind(this));
	} else if ((this._isHidden = "msHidden") in document) {
		document.addEventListener("msvisibilitychange", this.onTabChange.bind(this));
	} else if ("onfocusin" in document) {
		document.onfocusin = document.onfocusout = this.onTabChange.bind(this);
	} else {
		window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this.onTabChange.bind(this);
	}
}
