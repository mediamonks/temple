/* eslint-disable no-undef */
import Component from './Component';
import getEnabler from '../util/getEnabler';
import EventDispatcherComponent from './EventDispatcherComponent';
import EventType from '../event/EventType';
import ElementComponent from './ElementComponent';

export default class ExpandableDoubleClickComponent extends Component {
  static requires = [ElementComponent, EventDispatcherComponent];

  isExpanded = false;
  isExpanding = false;
  isCollapsing = false;
  autoExpand;
  config;

  constructor(config) {
    super();

    if (!config) {
      throw new Error('ExpandableDoubleClickComponent requires .richmediarc config');
    }

    this.config = config;

    if (!this.config.expandable) {
      console.error('No expandable config set.');
      return;
    }

    this.autoExpand = config.expandable.autoExpand;
    this.size = config.expandable;
    this.isExpanded = false;
    this.isExpanding = false;
    this.isCollapsing = false;

    this.initExpandingModule();
  }

  init() {
    return super
      .init()
      .then(() => getEnabler())
      .then(Enabler => {
        Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, this.handleExpandStart);
        Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, this.handleExpandFinish);
        Enabler.addEventListener(
          studio.events.StudioEvent.COLLAPSE_START,
          this.handleCollapseStart,
        );
        Enabler.addEventListener(
          studio.events.StudioEvent.COLLAPSE_FINISH,
          this.handleCollapseFinish,
        );

        const dispatcher = this.getEntity().getComponent(EventDispatcherComponent);
        if (!dispatcher) {
          throw new Error('Expandable DoubleClick Component needs EventDispatcher component');
        }

        dispatcher.addEventListener(EventType.EXIT, this.handleExit);
      });
  }

  handleExpandStart = e => {
    Enabler.finishExpand(e);
  };

  handleCollapseStart = e => {
    Enabler.finishCollapse(e);
  };

  handleExpandFinish = e => {
    const eventDispatcher = this.getComponent(EventDispatcherComponent);
    const element = this.getComponent(ElementComponent).get();

    this.isExpanded = true;
    this.isExpanding = false;
    element.style.width = `${this.size.width}px`;
    element.style.height = `${this.size.height}px`;
    element.classList.add('expanded');

    if (this.autoExpand) {
      this.autoExpand = false;
      return;
    }

    eventDispatcher.dispatchEvent(EventType.EXPAND, e);

    Enabler.counter('Expand', true);
  };

  handleCollapseFinish = e => {
    this.isExpanded = false;
    this.isCollapsing = false;

    const elementComponent = this.getComponent(ElementComponent);
    const eventDispatcher = this.getComponent(EventDispatcherComponent);

    const element = elementComponent.get();

    element.style.width = `${this.size.width}px`;
    element.style.height = `${this.size.height}px`;
    element.classList.remove('expanded');

    eventDispatcher.dispatchEvent(EventType.COLLAPSE, e);
    Enabler.counter('Collapse', true);
  };

  requestExpand(e) {
    if (this.isExpanded || this.isExpanding) return;
    this.isExpanding = true;
    Enabler.requestExpand(e);
  }

  handleExit(e) {
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
