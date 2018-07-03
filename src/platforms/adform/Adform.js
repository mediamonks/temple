/**
 * The platform class for AdForm creatives. Handlers initial AdForm enabler setups and overrides the
 * temple.tracker method with AdForm specific tracking api calls.
 *
 * @class Platform
 * @extends temple.core.Core
 * @namespace temple.platforms.adform
 * @module Platforms
 * @constructor
 */

export default class Adform extends Core {


	constructor ()
	{
		super();
		temple.color = "#065d91";
		temple.type = "Adform";
		temple.utils.tracker = this._tracker;

		this._platform = {
			type: temple.type,
			_resize: function (w, h) {
				dhtml.external.resize && dhtml.external.resize(w, h);
			},
			_closeOverlay: function () {
				dhtml.external.close && dhtml.external.close();
			}
		};

		loadScript(window.API_URL || 'https://s1.adform.net/banners/scripts/rmb/Adform.DHTML.js?bv=' + Math.random(), this._initCore.bind(this));
	}

	exit ()
	{
		var click = dhtml.getVar('clickTAG', this.config.clickTag || '');
		var clickTarget = dhtml.getVar('landingPageTarget', '_blank');
		window.open(click, clickTarget);
		this.dispatchEvent(temple.events.EXIT);
	}


	// private

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
		dhtml.sendEvent(this._trackedEvents.indexOf(title) + 1, title);
		temple.utils.debug('Tracked Event: ' + (this._trackedEvents.indexOf(title) + 1) + ' - ' + title, 'green');
	}
}
