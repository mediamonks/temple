import Module from '../Module.js';
export default class MonetModule extends Module {


	constructor(config, banner) {
		super();
		this.version = "1.6.3";
		this.banner = banner;
		this.backup = config.backup;

		if (!window["Monet"]) {
			temple.utils.loadScript([
					"https://ae.nflximg.net/monet/scripts/monet.min.js",
					"https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
				],
				this.loadBackupData.bind(this));
			temple.utils.debug('Monet.js not found. Automatically loaded from MonetModule', 'green');
		} else {
			this.loadBackupData();
		}
	}

	loadBackupData() {
		temple.utils.loadJSON(Enabler.getUrl(this.backup), this.buildRequest.bind(this));
	}

	buildRequest(backupData) {
		this.backupData = backupData;
		Monet.initialize(Enabler, {});
		Monet.logEvent('MONET_INITIALIZED');
		Monet.load(Monet.buildMonetRequest(), this.onMonetReady.bind(this), this.onMonetFailed.bind(this));
	}

	onMonetReady(dynamicContent) {
		this.data = dynamicContent;
		Monet.logEvent('MONET_ASSETS_LOADED');

		try {
			this.setDynamicVars();
		} catch(e) {
			this.onMonetFailed(e);
		}
	}

	onMonetFailed(errors) {
		this.backupDataUsed = true;
		this.dispatchEvent(temple.events.MONET_FAILED, {error:errors});
		this.data = this.backupData;
		this.setDynamicVars();
		Monet.logEvent('BACKUP_ASSETS_LOADED');
	}

	loadFonts() {
		var locales = [];
		var fonts = {};
		var subsetCharacters = "";
		var fontFamilies = {
			en: ['Netflix Sans'],
			he: ['Noto Sans Hebrew','Assistant','Rubik'],
			ja: ['Noto Sans JP'],
			zh: ['M Hei HK', 'Noto Sans TC'],
			th: ['Neue Helvetica Thai','Prompt'],
			ar: ['Neue Helvetica Arab','Changa','Droid Arabic Kufi'],
			ko: ['Nanum Gothic']
		}

		for (var i in this.data.rootAssets) {
			console.log(i)
			if (i.split('.')[0] == 'text') {
				locales.push(Monet.getComponentLocale(i).substr(0,2));
				subsetCharacters += this.data.rootAssets[i].text;
			}
		}

		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		locales = locales.filter(onlyUnique);

		for (var i = 0; i < locales.length; i++) {
			switch(locales[i]) {
				case 'he':
					fonts.he = {
						links: [
							'https://fonts.googleapis.com/earlyaccess/notosanshebrew.css',
							'https://fonts.googleapis.com/css?family=Assistant:400,600,700&subset=hebrew',
							'https://fonts.googleapis.com/css?family=Rubik:400,700&subset=hebrew'
						],
						fams: fontFamilies.he.slice()
					};
					break;

				case 'ja':
					fonts.ja = {
						links: [
							'https://fonts.googleapis.com/earlyaccess/notosansjp.css'
						],
						fams: fontFamilies.ja.slice()
					};
					break;

				case 'zh':
					fonts.zh = {
						links: [
							'https://ae.nflximg.net/monet/fonts/chinese/mheihk.css',
							'https://fonts.googleapis.com/earlyaccess/notosanstc.css'
						],
						fams: fontFamilies.zh.slice()
					};
					break;

				case 'th':
					fonts.th = {
						links: [
							'https://ae.nflximg.net/monet/fonts/thai/neuehelveticathai.css',
							'https://fonts.googleapis.com/css?family=Prompt:400,600,700&subset=thai'
						],
						fams: fontFamilies.th.slice()
					};
					break;

				case 'ar':
					fonts.ar = {
						links: [
							'https://ae.nflximg.net/monet/fonts/arabic/neuehelveticaarabic.css',
							'https://fonts.googleapis.com/css?family=Changa:400,600,700&subset=arabic',
							'https://fonts.googleapis.com/earlyaccess/droidarabickufi.css'
						],
						fams: fontFamilies.ar.slice()
					};
					break;

				case 'ko':
					fonts.ko = {
						links: [
							'https://fonts.googleapis.com/earlyaccess/nanumgothic.css'
						],
						fams: fontFamilies.ko.slice()
					};
					break;

				default:
					fonts.en = {
						links: [
							'https://ae.nflximg.net/monet/fonts/netflixsans.css'
						],
						fams: fontFamilies.en.slice()
					};
			}
		}

		var failed = [];

		function onComplete() {
			if (failed.length) {
				var urls = [];
				var fams = [];
				for (var i = 0; i < failed.length; i++) {
					for (f in fontFamilies) {
						var index = fontFamilies[f].indexOf(failed[i]);
						if (index > -1) {
							if (fontFamilies[f][index+1]) {
								urls.push(fonts[f].links.shift());
								fams.push(fonts[f].fams.shift());
							}
							break;
						}
					}
				}

				if (urls[0]) {
					WebFontConfig.custom.families = fams;
					WebFontConfig.custom.urls = urls;
					WebFont.load(WebFontConfig);
				} else {
					this.fontsLoaded = true;
					this.initMonetModule();
				}

				failed = [];
			} else {
				this.fontsLoaded = true;
				this.initMonetModule();
			}
		}

		var urls = [];
		var fams = [];

		for (var i in fonts) {
			var u = fonts[i].links.shift();
			var f = fonts[i].fams.shift();
			if (u) {
				urls.push(u);
				fams.push(f);
			}
		}

		var WebFontConfig = {
			custom: {
				families: fams,
				urls: urls
			},
			timeout: 2000,
			active: onComplete.bind(this),
			inactive: onComplete.bind(this),
			fontinactive: function(familyName) {
				failed.push(familyName);
			}
		};

		WebFont.load(WebFontConfig);
	}

	setDynamicVars() {
		this.loadFonts();
		this.dispatchEvent(temple.events.MONET_DATA, {data:this.data});
		this.dynamicElements = document.querySelectorAll('[data-dynamic]');
		if (document.body.hasAttribute('data-dynamic-exit')) {
			this.exitURLs = this.parseDataArray('exit');
		}

		if (temple.config.variation === "rich") {
			temple.config.video.sources = this.parseDataArray('video');
		}

		this.imagesToLoad = 0;

		for (var i = 0; i < this.dynamicElements.length; i++) {
			var d = this.dynamicElements[i].getAttribute('data-dynamic');
			try {
				var p = 'this.data.' + d;p = p.split('.');p.pop();p = eval(p.join('.'));
				d = eval('this.data.' + d);
			} catch(error) {
				var dd = this.dynamicElements[i].getAttribute('data-dynamic');
				Monet.logEvent("MONET_DATA_ERROR", { "stack": error, "details": "Could not find dynamic data in : " + dd } );
			}
			var svg = {};

			if (this.dynamicElements[i].nodeName == "IMG") {
				if(!d.length) continue;
				if(this.dynamicElements[i].hasAttribute('noload')) continue;
				this.imagesToLoad = (this.imagesToLoad+1) || 1;
				this.dynamicElements[i].onload = this.imageLoaded.bind(this);
				this.dynamicElements[i].onerror = this.imageLoaded.bind(this);
				this.dynamicElements[i].src = d;
			} else if (this.dynamicElements[i].nodeName == "svg") {
				if(!d.length) continue;
				this.imagesToLoad = (this.imagesToLoad+1) || 1;
				svg[i] = {xhr:new XMLHttpRequest(), id:i};
				svg[i].xhr.id = i;
				svg[i].xhr.onload = function(e) {
					var r = e.currentTarget.responseXML.documentElement;
					r.setAttribute('class', this.dynamicElements[e.currentTarget.id].getAttribute('class'));
					var id = this.dynamicElements[e.currentTarget.id].getAttribute('id');
					r.setAttribute('id', id);
					this.dynamicElements[e.currentTarget.id].parentNode.replaceChild(r, this.dynamicElements[e.currentTarget.id]);
					this.imageLoaded();
				}.bind(this);
				svg[i].xhr.open('GET', d, !0);
				svg[i].xhr.overrideMimeType("image/svg+xml");
				svg[i].xhr.send("");
			} else {
				if (p.type == "image") {
					if(!d.length) continue;
					if(this.dynamicElements[i].hasAttribute('noload')) continue;
					var img = new Image();
					this.imagesToLoad = (this.imagesToLoad + 1) || 1;
					img.onload = this.imageLoaded.bind(this);
					img.onerror = this.imageLoaded.bind(this);
					img.src = d;
					img.div = this.dynamicElements[i];
					this.dynamicElements[i].style.backgroundImage = "url('" + d + "')";
				} else {
					this.dynamicElements[i].innerHTML = d;
				}
			}
		}

		if (!this.imagesToLoad) {
			this.monetReady = true;
			this.initMonetModule();
		}
	}

	imageLoaded(e) {
		if (e.target.div) {
			e.target.div.style.width = e.target.width+"px";
			e.target.div.style.height = e.target.height+"px";
		}
		this.imagesLoaded = this.imagesLoaded + 1 || 1;

		if (this.imagesLoaded == this.imagesToLoad) {
			this.monetReady = true;
			this.initMonetModule();
		}
	}

	parseDataArray(a) {
		var s = [];
		var v = document.body.getAttribute('data-dynamic-' + a);

		if (v) {
			v = v.split(',');

			for (var i = 0; i < v.length; i++) {
				try {
					var d = eval('this.data.'+v[i]).split(',');
				} catch(error) {
					Monet.logEvent("MONET_DATA_ERROR", { "stack": error, "details": "could not find dynamic data in : " + v[i] } );
				}
				s = s.concat(d);
			}

		}

		return s;
	}

	addtracking() {
		if (this.banner.videoController) {
			this.addTrackingListeners(this.banner.videoController);
		}

		else {
			this.addTrackingListeners();
		}
	}

	initMonetModule() {
		if (!this.fontsLoaded || !this.monetReady) return;
		this.setImpressionLogging();
		this.done();
	}

	setImpressionLogging() {
		this.impressionLoggingArray = this.data.assetGroups.length > 1 ? ["MULTI_TITLE"] : ["SINGLE_TITLE"];
		if(temple.config.monet.title_type) this.impressionLoggingArray = [temple.config.monet.title_type];

		if (temple.events.EXPAND) {
			this.impressionLoggingArray.push("EXPANDING");
		}

		if (temple.events.VideoEvents) {
			this.impressionType = "RICH_MEDIA";
			this.impressionLoggingArray.push("VIDEO");

			if (temple.config.video.autoplay) {
				this.impressionLoggingArray.push("AUTOPLAY");
				this.banner.addEventListener(temple.events.VideoEvents.AUTOPLAY, this.addtracking.bind(this));
			} else {
				this.banner.addEventListener(temple.events.SHOW, this.addtracking.bind(this));
			}
		} else {
			this.impressionType = "STANDARD";
			this.addtracking();
		}

		if (temple.config.monet.skills) {
			this.impressionLoggingArray = this.impressionLoggingArray.concat(temple.config.monet.skills);
		}

		Monet.logEvent("MONET_IMPRESSION", { "type": this.impressionType, "skills": this.impressionLoggingArray });
	}

	trackMonetVideoEvent_PLAY(event) {
		Monet.logEvent("VIDEO_PLAY", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_PAUSE(event) {
		Monet.logEvent("VIDEO_PAUSE", {	"url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_STOP(event) {
		Monet.logEvent("VIDEO_STOP", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_MUTE(event) {
		Monet.logEvent("VIDEO_MUTE", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_UNMUTE(event) {
		Monet.logEvent("VIDEO_UNMUTE", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_FIRST_QUARTER(event) {
		Monet.logEvent("VIDEO_FIRST_QUART", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_SECOND_QUARTER(event) {
		Monet.logEvent("VIDEO_SECOND_QUART", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_THIRD_QUARTER(event) {
		Monet.logEvent("VIDEO_THIRD_QUART", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.video.getCurrentTime()
		});
	}

	trackMonetVideoEvent_COMPLETE(event) {
		Monet.logEvent("VIDEO_COMPLETE", { "url": "https://www.youtube.com/watch?v=" + event.target.currentVideo.source,
			"pos": event.target.currentVideo.duration
		});
	}

	trackMonetEvent_CLICK(event) {
		var t = String(event.target);
		Monet.logEvent("CLICK", { "src": t, "coords": { "x": event.clientX, "y": event.clientY } });
	}

	trackMonetEvent_EXIT(event) {
		Monet.logEvent("AD_EXIT", {	"url": event.url });
	}

	trackMonetExpandableEvent_EXPAND(event) {
		Monet.logEvent("UNIT_RESIZE", {	"type": "expand",
			"Size": { "width": temple.config.expandable.width, "height": temple.config.expandable.height }
		});
	}

	trackMonetExpandableEvent_COLLAPSE(event) {
		Monet.logEvent("UNIT_RESIZE", {	"type": "collapse",
			"Size": { "width": temple.config.size.width, "height": temple.config.size.height }
		});
	}

	addTrackingListeners(controller) {
		this.banner.banner.addEventListener("click", this.trackMonetEvent_CLICK.bind(this));
		this.banner.addEventListener(temple.events.EXIT, this.trackMonetEvent_EXIT.bind(this));

		if (controller) {
			for (var i = 0; i < controller.sources.length; i++) {
				controller.sources[i].addEventListener(temple.events.VideoEvents.COMPLETE, 			this.trackMonetVideoEvent_COMPLETE.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.CLOSE, 			this.trackMonetVideoEvent_STOP.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.STOP, 				this.trackMonetVideoEvent_STOP.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.MUTE, 				this.trackMonetVideoEvent_MUTE.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.UNMUTE, 			this.trackMonetVideoEvent_UNMUTE.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.FIRST_QUARTER, 	this.trackMonetVideoEvent_FIRST_QUARTER.bind(this),false);
				controller.sources[i].addEventListener(temple.events.VideoEvents.SECOND_QUARTER, 	this.trackMonetVideoEvent_SECOND_QUARTER.bind(this),false);
				controller.sources[i].addEventListener(temple.events.VideoEvents.THIRD_QUARTER, 	this.trackMonetVideoEvent_THIRD_QUARTER.bind(this),false);
				controller.sources[i].addEventListener(temple.events.VideoEvents.PLAY, 				this.trackMonetVideoEvent_PLAY.bind(this));
				controller.sources[i].addEventListener(temple.events.VideoEvents.PAUSE, 			this.trackMonetVideoEvent_PAUSE.bind(this));
			}
		}

		if (temple.config.expandable) {
			if (!this.banner.lightboxModule) {
				this.banner.expandingModule.addEventListener(temple.events.EXPAND, this.trackMonetExpandableEvent_EXPAND.bind(this));
				this.banner.expandingModule.addEventListener(temple.events.COLLAPSE, this.trackMonetExpandableEvent_COLLAPSE.bind(this));
			} else {
				this.banner.lightboxModule.addEventListener(temple.events.EXPAND, this.trackMonetExpandableEvent_EXPAND.bind(this));
				this.banner.lightboxModule.addEventListener(temple.events.COLLAPSE, this.trackMonetExpandableEvent_COLLAPSE.bind(this));
			}
		}
	}

	Object.defineProperty(MonetModule.prototype, "_data", {
	get: function (e) {
		return this.data;
	},
	enumerable: true,
	configurable: true
});

return MonetModule;

} )( temple.core.Module );

Object.assign(temple.events, {
	MONET_DATA: "monet_data",
	MONET_FAILED: "monet_failed"
});