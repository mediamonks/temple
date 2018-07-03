temple.modules.VideoModule = ( function(_super, id, controller) { 
	__extends(VideoModule, _super);
	
	function VideoModule(id, controller) {
		this._construct(id, controller);
		this.version = "2.3.0";
	}
	
	VideoModule.prototype.createPlayer = function createPlayer(id) {
		temple.PlayerState = {
			'ENDED': 	'ended',
			'PLAYING': 	'loadeddata',
			'PAUSED': 	'pause',
			'CUED': 	'loadstart',
			'BUFFERING': 'play',
			'LOADED': 	'loadeddata',
			'VOLUME': 	'volumechange'
		}

		this._video 			= document.createElement('video');
		this._video.width 		= this.config.size[id] ? this.config.size[id].width : this.config.size[0].width;
		this._video.height 		= this.config.size[id] ? this.config.size[id].height : this.config.size[0].height;

		this._video.addEventListener('ended',		this.onStateChanged.bind(this));
	 	this._video.addEventListener('play',			this.onStateChanged.bind(this));
	 	this._video.addEventListener('pause',		this.onStateChanged.bind(this));
	 	this._video.addEventListener('volumechange', this.onStateChanged.bind(this));
	 	this._video.addEventListener('loadeddata', 	this.onStateChanged.bind(this));

		this.spinner = document.createElement('div');
		this.wrapper.insertBefore(this.spinner, this.wrapper.firstChild);
	 	this.spinner.classList.add('spinner');
		this.spinner.innerHTML = '<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"> <stop stop-color="#fff" stop-opacity="0" offset="0%"/> <stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/> <stop stop-color="#fff" offset="100%"/> </linearGradient> </defs> <g fill="none" fill-rule="evenodd"> <g transform="translate(1 1)"> <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2"> <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/> </path> <circle fill="#fff" cx="36" cy="18" r="1"> <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/> </circle> </g> </g></svg>';
		temple.utils.createStyle('.spinner', 'position:absolute;top:50%;left:50%;width:38px;height:38px;transform:translate(-50%,-50%)');
		
		this._video.removeAttribute("controls");
		this.container.appendChild(this._video);
		this.video = {
			'cueVideoById': function(src) {
                var htmlElem = document.getElementsByTagName('html')[0];
                var isInception = htmlElem.hasAttribute('monet-inception-pristine-element');
                if (typeof(Enabler)!== "undefined" && !isInception) {
                    this._video.src = Enabler.getUrl(src);
                } else {
                    this._video.src = src;
                }
			}.bind(this),
			'getDuration': function() {
				return this._video.duration;
			}.bind(this),
			'getCurrentTime': function() {
				return this._video.currentTime;
			}.bind(this),
			'isMuted': function() {
				return this._video.muted;
			}.bind(this),
			'pauseVideo': function() {
				this._video.pause();
			}.bind(this),
			'playVideo': function() {
				this._video.play();
			}.bind(this),
			'unMute': function() {
				this._video.muted = false;
			}.bind(this),
			'mute': function() {
				this._video.muted = true;
			}.bind(this),
			'seekTo': function(t) {
				this._video.currentTime = t;
			}.bind(this)
		}

		this.resize();
		this.setEvents();
		this.hide(true);
		this.done();

		if (temple.isAutoplayAvailable())
		this.controller.banner.addEventListener('show', function() {
			if (this.config.autoplay === true && temple.isMobile) {
				this.show();
				this.setSource(0);
				this._video.setAttribute('autoplay', '');
				this._video.setAttribute('playsinline', '');
				this._video.setAttribute('muted', '');
			}
		}.bind(this));
	}
	
	VideoModule.prototype.togglePlay = function togglePlay() {
		if (this._video.paused) { this.resume(); } else { this.pause(); }
	}
	
	VideoModule.prototype.stop = function stop() {
		if (!this.active) return;
		_super.prototype.stop.call(this);
	}

	VideoModule.prototype.getPlayerState = function getPlayerState() {
		if (this.active === false) {
			return 0;
		} else {
			if (this._video.ended) return 'ended';
			else return 'idle';
		}		
	}

	VideoModule.prototype.setTracking = function setTracking() {
		if (this.controller.banner.setVideoTracking) this.controller.banner.setVideoTracking(this);
	}

	return VideoModule;

} )( temple.modules.iVideoModule );


 /**
 * VideoModule class.
 * 
 * @class temple.modules.VideoModule
 * @constructor
 * @extends temple.modules.iVideoModule
 */