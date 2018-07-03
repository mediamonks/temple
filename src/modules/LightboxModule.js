temple.modules.LightboxModule = ( function( _super ) {
	__extends(LightboxModule, _super);
	function LightboxModule() {
		Enabler.setHint('expansionMode', 'lightbox');

		this.version = "1.3.0";
		
		if (typeof Enabler == 'undefined') {
			console.error('LightboxModule is a DoubleClick component. Enabler was not found.');
			return;
		}

		this.template = arguments[0].template || arguments[0];
		this.config = temple.config;
		this.onReady = arguments[0].onReady;
		this.config.fullscreen = this.config.expandable.fullscreen;

		this.setOrientation();

		if (this.config.expandable.lockOrientation) {
			this.lockOrientation(this.config.expandable.lockOrientation);
		}

		if (!this.config.expandable) {
			console.error('No expandable config set.');
			return;
		}
		
		this.size = this.config.expandable;
	
		this.initLightboxModule();
	}

	LightboxModule.prototype.initLightboxModule = function() {
		Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, 		this.fullScreenDimensionsHandler.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, 	this.expandStart.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH,	this.expandFinish.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START,	this.collapseStart.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH,	this.collapseFinish.bind(this));
		window.addEventListener('resize', this.setOrientation.bind(this), false);

		this.done();
	}

	LightboxModule.prototype.setOrientation = function() {
		this.orientation = Enabler.getOrientation().getMode();

		if (temple.isMobile) {
			if (window.screen.availHeight > window.screen.availWidth) {
				this.orientation = 'portrait';
			} else {
				this.orientation = 'landscape'; 
			}
			if (temple.isiOS) {
				if (window.orientation == 0) {
					this.orientation = 'portrait';
				} else {
					this.orientation = 'landscape';
				}
			}
		}
		this.bannerOrientation = this.template.width > this.template.height ? 'landscape' : 'portrait';
		this.dispatchEvent('setOrientation', {orientation:this.orientation, bannerOrientation:this.bannerOrientation});
	}

	LightboxModule.prototype.lockOrientation = function(orientation) {
		temple.utils.debug('Lock Lightbox Orientation: ' + orientation);
		this.orientationLock = orientation;
		Enabler.addEventListener(studio.events.StudioEvent.ORIENTATION, this.onOrientationChanged.bind(this), false);
	}

	LightboxModule.prototype.fullScreenDimensionsHandler = function(e) {
		var w = e.width;
		var h = e.height;

		if (!temple.isMobile) {
			var p;
			w = e.width > this.config.expandable.width ? this.config.expandable.width : e.width;
			h = e.height > this.config.expandable.height ? this.config.expandable.height : e.height;
			if (w < this.config.expandable.width) {
 				p = w / this.config.expandable.width;
				h = h * p;
			}
			if (h < this.config.expandable.height) {
				p = h / this.config.expandable.height;
				w = w * p;
			}
		}
		this.expandWidth = this.expandWidth || Math.floor(w);
		this.expandHeight = this.expandHeight || Math.floor(h);

		if (this.config.expandable.keepRatio) {
			if (this.orientation == 'portrait') {
				if (this.config.expandable.width > this.config.expandable.height) {
					var tw = this.config.expandable.width;
					this.config.expandable.width = this.config.expandable.height;
					this.config.expandable.height = tw;					
				}
			} else {
				if (this.config.expandable.height > this.config.expandable.width) {
					var tw = this.config.expandable.width;
					this.config.expandable.width = this.config.expandable.height;
					this.config.expandable.height = tw;					
				}
			}

			var r = this.config.expandable.height / this.config.expandable.width;
			w = e.width > this.config.expandable.width ? this.config.expandable.width : e.width;
			h = e.height > this.config.expandable.height ? this.config.expandable.height : e.height;
			h = w * r;

			if (h > e.height) {
				h = e.height;
				w = e.height / r;
			}

			this.expandWidth = Math.floor(w);
			this.expandHeight = Math.floor(h);
		}

		this.expandedScale = this.expandWidth / this.config.expandable.width; 

		temple.utils.debug("expand " + this.expandWidth + ", " + this.expandHeight);
		Enabler.requestFullscreenExpand(this.expandWidth, this.expandHeight);

		this.dispatchEvent(temple.events.FULLSCREEN_DIMENSIONS, {width:e.width, height:e.height});
	}

	LightboxModule.prototype.expandStart = function() {
		Enabler.finishFullscreenExpand();
	}

	LightboxModule.prototype.collapseStart = function() {
		Enabler.finishFullscreenCollapse();
	}

	LightboxModule.prototype.expandFinish = function(e) {
		this.isExpanded = true;
		this.template.banner.style.width = this.config.fullscreen ? "100%" : this.size.width > this.expandWidth ? this.expandWidth + "px" : this.size.width + "px";
		this.template.banner.style.height = this.config.fullscreen ? "100%" : this.size.height > this.expandHeight ? this.expandHeight + "px" : this.size.height + "px";
		this.template.banner.classList.add('expanded');
		this.setOrientation();
		this.dispatchEvent(temple.events.EXPAND, e);
		Enabler.startTimer('Panel Expansion');
		Enabler.counter('Expand', true);
	}

	LightboxModule.prototype.collapseFinish = function(e) {
		this.isExpanded = false;
		this.template.banner.style.width = this.config.size.width + "px";
		this.template.banner.style.height = this.config.size.height + "px";
		this.template.banner.classList.remove('expanded');
		this.dispatchEvent(temple.events.COLLAPSE, e);
		Enabler.stopTimer('Panel Expansion');
		Enabler.counter('Collapse', true);
	}
	
	LightboxModule.prototype.expand = function(e) {
		if (this.isExpanded) return;
		if (this.orientationLock && this.expandCooldown !== false) {
			this.expandCooldown = true;
			if (this.orientationLock != this.orientation) {
				temple.utils.debug('Orientation is locked to: ' + this.orientationLock);
				this.dispatchEvent(temple.events.ORIENTATION_LOCKED, {locked:this.orientationLock});
				return;
			}
		}
		if (this.expandCooldown === false) {
			this.expandCooldown = true;			
		}
		Enabler.queryFullscreenDimensions();
	}

	LightboxModule.prototype.collapse = function(e) {
		if (!this.isExpanded) return;
		this.expandCooldown = null;
		Enabler.requestFullscreenCollapse(e);
	}

	LightboxModule.prototype.onOrientationChanged = function(e) {
		this.setOrientation();

		if (this.orientation == this.orientationLock) {
			if (this.expandCooldown) {
				this.expandCooldown = false;
				setTimeout(this.expand.bind(this), 100);
			}
		} else {
			this.collapse();
		}			
	}

	return LightboxModule;

})( temple.core.Module );

temple.LightboxModule = temple.modules.LightboxModule;

Object.assign(temple.events, {
	EXPAND:"banner_expand",
	COLLAPSE:"banner_collapse",
	ORIENTATION_LOCKED: "orientation_locked"
});




/**
 * LightboxModule for Doubleclick lightbox creatives.
 * 
 * @class temple.modules.LightboxModule
 * @module ExpandingModule
 * @constructor
 * @extends temple.core.Module
 */

 /**
 * Config that is included in the creative config.json.
 * @property config
 * @type {Object}
 * @default 
		   {
				"expandable": {
					"width": 970,
			        "height": 500,
			        "fullscreen": false,
			        "lockOrientation": "landscape"
				}
		   }
 */

 /**
 * True when the creative is in expanded state.
 * @property isExpanded
 * @type {Boolean}
 */

 /**
 * The orientation that the device is currently in.
 * @property orientation
 * @type {String}
 */

/**
 * Expand.
 * @method expand
 */
 
/**
 * Collapse.
 * @method collapse
 */
 
 /**
 * Dispatched when the creative expands.
 * @event temple.events.EXPAND
 */

 /**
 * Dispatched when the creative collapses.
 * @event temple.events.COLLAPSE
 */

 /**
 * Dispatched when the creative tries to expand while an orientation lock is in place and the device is not in the proper orientation.
 * @event temple.events.ORIENTATION_LOCKED
 */