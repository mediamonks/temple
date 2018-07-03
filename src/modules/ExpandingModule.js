export default class ExpandingModule extends Module {


	constructor ()
	{
		this.version = "1.1.3";
		if (typeof Enabler == 'undefined')
		{
			console.error('ExpandingModule is a DoubleClick component. Enabler was not found.')
			return;
		}

		this.template = arguments[0].template || arguments[0];
		this.config = temple.config;
		this.onReady = arguments[0].onReady;

		if (!this.config.expandable)
		{
			console.error('No expandable config set.');
			return;
		}

		this.autoExpand = this.config.expandable.autoExpand;
		this.size = this.config.expandable;
		this.isExpanded = false;
		this.isExpanding = false;
		this.isCollapsing = false;
		Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, this.expandStart.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, this.expandFinish.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, this.collapseStart.bind(this));
		Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, this.collapseFinish.bind(this));
		this.template.addEventListener(temple.events.EXIT, this.collapse.bind(this));
		this.initExpandingModule();
	}

	initExpandingModule ()
	{
		this.done();
	}

	expandStart (e)
	{
		Enabler.finishExpand(e);
	}

	collapseStart (e)
	{
		Enabler.finishCollapse(e);
	}

	expandFinish (e)
	{
		this.isExpanded = true;
		this.isExpanding = false;
		this.template.banner.style.width = this.size.width + "px";
		this.template.banner.style.height = this.size.height + "px";
		this.template.banner.classList.add('expanded');

		if (this.autoExpand)
		{
			this.autoExpand = false;
			return;
		}

		this.dispatchEvent(temple.events.EXPAND, e);
		Enabler.counter('Expand', true);
	}

	collapseFinish (e)
	{
		this.isExpanded = false;
		this.isCollapsing = false;
		this.template.banner.style.width = this.config.size.width + "px";
		this.template.banner.style.height = this.config.size.height + "px";
		this.template.banner.classList.remove('expanded');
		this.dispatchEvent(temple.events.COLLAPSE, e);
		Enabler.counter('Collapse', true);
	}

	expand (e)
	{
		if (this.isExpanded || this.isExpanding) return;
		this.isExpanding = true;
		Enabler.requestExpand(e);
	}

	collapse (e)
	{
		if (!this.isExpanded || this.isCollapsing) return;
		this.isCollapsing = true;
		Enabler.requestCollapse(e);
	}

}


/**
 * ExpandingModule for Doubleclick expanding creatives.
 * 
 * @class temple.modules.ExpandingModule
 * @module ExpandingModule
 * @constructor
 * @extends temple.core.Module
 */

 /**
 * True when the creative is in expanded state.
 * @property isExpanded
 * @type {Boolean}
 */

 /**
 * True while the creative is collapsing but not quite there yet.
 * @property isCollapsing
 * @type {Boolean}
 */

 /**
 * True while the creative is expanding but not quite there yet.
 * @property isExpanding
 * @type {Boolean}
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