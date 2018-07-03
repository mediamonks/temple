import Core from "../temple/Core";
import loadJSON from "../temple/util/loadJSON";
import isValidURL from "../temple/util/isValidURL";


export default class MonetBanner extends Core {
	constructor() {
		super();


		temple.type = "Monet";
		temple.color = "#7b1df1";
		temple.utils.debug('Template <'+arguments.callee.name+'>');
	}

	show(autoplay) {
		if(DEBUG)
		{
			if (document.body.classList.contains('phantom-backup')) {
				this.onBackupImage();
			}
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
			this.exit(this.monetData.rootAssets["url.Exit_URL_iOS"].url);
			return
		}

		if (temple.isMobile) {
			this.exit(this.monetData.rootAssets["url.Exit_URL_Android"].url);
			return
		}

		this.exit(this.monetData.rootAssets["url.Exit_URL_Desktop"].url);
	}

	onShow() { }
	onTabChange() { }
	onBackupImage() { }
	onExit() { }
	onOver(e) { }
	onOut(e) { }
	init(e) { }


	// protected

	_bannerInit() {
		super._bannerInit();
		this._ready();
	}

	exit(url) {
		url = isValidURL(url) ? url : null;
		this.dispatchEvent(temple.events.EXIT,url||this.defaultExitURL);
		Enabler.exitOverride('Default Exit', url||this.defaultExitURL);
	}



// private

	_ready() {
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

		this._addTabEvents();

		if (this._addExitEvents) this._addExitEvents();
		else this.addEventListener(temple.events.EXIT, this.onExit.bind(this));

		this._politeLoads( function() {
			if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && !window.innerHeight) {
				window.onresize = function() {
					if (!temple.isVisible) {
						temple.isVisible = true;
						window.onresize = null;
						this._initComponent.call();
					}
				};

				if (!temple.isVisible) return;
			}
			this._initComponent();
		});

	}

	 readyEvent = () =>{
		this._webComponentReady();
	}

	 _initComponent() {
		this.monetComponent = document.querySelector("monet-integrator");

		if (this.monetComponent.hasAttribute("ready")) {
			this._webComponentReady();
		} else {
			this.monetComponent.addEventListener("ready", this.readyEvent);
		}
	}

	 _webComponentReady() {
		this.monetComponent.removeEventListener("ready", readyEvent);
		this._validateMonetData().then(data => {
			this.monetData = data;

			function _ready() {
				this._setImpressionLogging();
				this.dispatchEvent(temple.events.READY);
				this.init();
			}

			if (this.initDynamicComponents) {
				this._initDynamicComponents().then(() => {
					_ready.call(this);
				});
			} else {
				_ready.call(this);
			}


		});
	}

	 _initDynamicComponents() {
		return new Promise((resolve, reject) => {
			this.initDynamicComponents(resolve);
		});
	}

	 _validateMonetData() {
		return new Promise((resolve, reject) => {
			this.monetComponent.getMonetData().then(data => {
				if (!data.isBackupData) {
					_getBackupMonetData.call(this).then(backupData => {
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
					});
				} else {
					resolve(data);
				}
			};
		});
	}

	 _getBackupMonetData() {
		return new Promise(function(resolve, reject) {
			// <-- REPLACE -->
			loadJSON(temple.config.monet.json, function(data) {
				/* <-- /REPLACE -->
					temple.utils.loadJSON("backup.json", function(data) {
				<-- //REPLACE --> */
				resolve(data);
			}, reject)
		}.bind(this));
	}

	 _setImpressionLogging() {
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

		this.banner.addEventListener("click", this._trackMonetEvent_CLICK.bind(this));
		this.addEventListener(temple.events.EXIT, this._trackMonetEvent_EXIT.bind(this));

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

	 _trackMonetEvent_CLICK = (event) => {
		var t = String(event.target);
		Monet.logEvent("CLICK", { "src": t, "coords": { "x": event.clientX, "y": event.clientY } });
	}

	 _trackMonetEvent_EXIT = (event) => {
		Monet.logEvent("AD_EXIT", { "url": event.url });
	}

	 _trackMonetExpandableEvent_EXPAND = (event) => {
		Monet.logEvent("UNIT_RESIZE", { "type": "expand",
			"Size": { "width": temple.config.expandable.width, "height": temple.config.expandable.height }
		});
	}

	 _trackMonetExpandableEvent_COLLAPSE = (event) => {
		Monet.logEvent("UNIT_RESIZE", { "type": "collapse",
			"Size": { "width": temple.config.size.width, "height": temple.config.size.height }
		});
	}

	 _addTabEvents() {
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

}
