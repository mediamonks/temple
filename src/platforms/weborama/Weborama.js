import Core from "../../Core";

export default class Weborama extends Core {

	constructor ()
	{
		super();
		this.defaultExitURL = "default";
		this.exitURLs = [""];

		temple.color = "#338e43";
		temple.type = "Weborama";
		temple.utils.tracker = this._tracker;

		this._platform = {
			_closeOverlay: function () {
			}
		};

		this._initCore();
		// temple.utils.loadScript('//media.adrcdn.com/scripts/screenad_interface_1.0.3_scrambled.js', this._initCore.bind(this));
	}

	exit (type)
	{
		screenad.click(type || this.defaultExitURL);
		this.dispatchEvent(temple.events.EXIT);
	}

	setVideoTracking (player)
	{
		// if (!studio.video) {
		// 	Enabler.loadModule(studio.module.ModuleId.VIDEO, function(){
		// 		this.setVideoTracking(player);
		// 	}.bind(this));
		// 	return;
		// }
		// if (player.playHistory) {
		// 	studio.video.Reporter.detach(player.playHistory[player.playHistory.length-1].id);			
		// 	studio.video.Reporter.attach(player.currentVideo.id, player._video);			
		// } else {
		// 	studio.video.Reporter.attach(player.currentVideo.id, player._video);			
		// }
	}


	//private

	_pageReady ()
	{
		this._pageLoaded();
	}

	_pageLoaded ()
	{
		this._bannerInit();
	}

	_tracker (title, repeat)
	{
		if (repeat == undefined) repeat = true;
		this._trackedEvents = this._trackedEvents || [];
		if (this._trackedEvents.length > 19) return;
		if (repeat === false && this._trackedEvents.indexOf(title) >= 0) return;
		if (this._trackedEvents.indexOf(title) == -1)
		{
			this._trackedEvents.push(title);
		}
		// dhtml.sendEvent(this._trackedEvents.indexOf(title) + 1, title);
		temple.utils.debug('Tracked Event: ' + (this._trackedEvents.indexOf(title) + 1) + ' - ' + title, 'green');
	}

}




/**
* The platform class for Weborama creatives. Handlers initial Weborama enabler setups and overrides the temple.tracker method with Weborama specific tracking api calls.
*
* @class Platform
* @extends temple.core.Core
* @namespace temple.platforms.weborama
* @module Platforms
* @constructor
*/
