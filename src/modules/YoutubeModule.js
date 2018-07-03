temple.modules.YoutubeModule = ( function(_super, id, controller) { 
	__extends(YoutubeModule, _super);

	function YoutubeModule(id, controller) {
		this._construct(id, controller);
		this.version = "2.5.4";
	}

	YoutubeModule.prototype.createPlayer = function createPlayer(id) {
		temple.PlayerState = {
			'ENDED': 	YT.PlayerState.ENDED,
			'PLAYING': 	YT.PlayerState.PLAYING,
			'PAUSED': 	YT.PlayerState.PAUSED,
			'CUED': 	YT.PlayerState.CUED,
			'BUFFERING': YT.PlayerState.BUFFERING,
			'LOADED': 	YT.PlayerState.PLAYING,
			'VOLUME': 	'volumechange'
		}

		this.video = new YT.Player(this.container, {
  			'videoId': 				this.sources[0],
			'width': 				'100%',
			'height': 				'100%',
			'allowfullscreen':		0,
			'fs': 					0, 
  			'playerVars': {
				'modestbranding': 	1,
  				'html5': 			1,
				'cc_load_policy': 	0,
				'iv_load_policy': 	3,
				'fs': 				0,
				'controls': 		this.config.controls[id] === undefined ? 2 : (this.config.controls[id] === false ? 0 : 2),
				'autoplay': 		temple.isSafari ? (this.config.autoplay ? 1 : 0) : 0,
				'playsinline': 		1,
				'rel': 				0,
				'showinfo': 		0
  			},
  			'events': {
  				'onReady': 			function() {
					this.container = this.wrapper.querySelector('#' + this.name + 'Container');
					if (temple.isSafari) {
						if (this.id != 0) {
							this.hide(true);
						} else {
							this.play(-1);
						}
					} else {
						this.hide(true);
					}
					this.setEvents();
					this.resize();
					this.done();
  				}.bind(this),
  				'onStateChange': 	this.onStateChanged.bind(this)
  			}
		});
	}

	YoutubeModule.prototype.setSource = function setSource(id) {
		_super.prototype.setSource.call(this, id);
		this.video.setPlaybackQuality('highres');
	}

	YoutubeModule.prototype.resize = function(size) {
		size = size || {};
		var i = this.config.size[this.id] ? this.id : 0;
		this.previousSize = {width:this.width,height:this.height};
		this.width = (size.width || this.config.size[i].width);
		this.height = (size.height || this.config.size[i].height);
		
		var padding = temple.isMobile ? 0 : 100;

		this.container.setAttribute("width", this.width);
		this.container.setAttribute("height", this.height + padding);

		TweenMax.set(this.bar, {width: this.width - 20});
		TweenMax.set([this._video, this.wrapper], {width:this.width, height:this.height});
		TweenMax.set(this.container, {width:this.width, height:this.height + padding, y: -(padding/2)});
	}

	YoutubeModule.prototype.togglePlay = function togglePlay() {
		switch (this.video.getPlayerState()) {
			case temple.PlayerState.CUED:
			case temple.PlayerState.PAUSED:
				this.resume();
			break;
			case temple.PlayerState.BUFFERING:
			case temple.PlayerState.ENDED:
				this.play(this.currentVideo.id);
			break;			
			default: this.pause();
		}
	}

	YoutubeModule.prototype.stop = function stop(dispatchEvent) {	
		if (!this.active && this.video.getPlayerState() != YT.PlayerState.BUFFERING) return;
		_super.prototype.stop.call(this, dispatchEvent);
	}

	YoutubeModule.prototype.close = function close(dispatchEvent) {
		if (this.getPlayerState() == YT.PlayerState.ENDED 
			&& this.container.classList.contains("hide") 
			&& this.video.getPlayerState() != YT.PlayerState.BUFFERING
			&& this.video.getPlayerState() != YT.PlayerState.PLAYING  
			//&& this.video.getPlayerState() != YT.PlayerState.CUED 
			&& this.video.getPlayerState() != undefined)
		{
			return false; 
		} 

		this.hide();
		if (dispatchEvent!=false) {
			this.dispatchEvents(temple.events.VideoEvents.CLOSE, { target: this });
		}
	}

	YoutubeModule.prototype.hide = function hide(noTween) {	
		_super.prototype.hide.call(this, noTween);
	}
	
	YoutubeModule.prototype.getPlayerState = function getPlayerState() {
		if (this.active === false) {
			return 0;
		} else {
			return this.video.getPlayerState();
		}		
	}

	return YoutubeModule;

} )( temple.modules.iVideoModule );

 /**
 * YoutubeModule class.
 * 
 * @class temple.modules.YoutubeModule
 * @constructor
 * @extends temple.modules.iVideoModule
 */
