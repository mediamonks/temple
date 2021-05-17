import getEnabler from '../util/getEnabler';
import EventDispatcher from '../event/EventDispatcher';
import Events from './Events';

let prom = null;

/**
 *
 * @return {null}
 */
export default function getEventDispatcher(){
  if(!prom){

    const eventDispatcher = new EventDispatcher();

    prom = getEnabler().then(Enabler => {
      const se = studio.events.StudioEvent;

      /**
       * Dispatched when an exit is invoked.
       */
      Enabler.addEventListener(se.EXIT, () => eventDispatcher.dispatchEvent(Events.EXIT));

      /**
       * Dispatched when an interaction occurs.
       */
      Enabler.addEventListener(se.INTERACTION, () => eventDispatcher.dispatchEvent(Events.INTERACTION));

      /**
       * Dispatched when orientation and/or orientation degrees change.
       */
      Enabler.addEventListener(se.ORIENTATION, () => eventDispatcher.dispatchEvent(Events.ORIENTATION));
      Enabler.addEventListener(se.PAGE_LOADED, () => eventDispatcher.dispatchEvent(Events.PAGE_LOADED));

      /**
       * Dispatched when the ad is hidden from the user. This is useful for environments where the
       * ad is rendered offscreen and displayed to the user at a later time, then possibly hidden.
       */
      Enabler.addEventListener(se.HIDDEN, () => eventDispatcher.dispatchEvent(Events.HIDDEN));
      Enabler.addEventListener(se.VISIBLE, () => eventDispatcher.dispatchEvent(Events.VISIBLE));

      // expandable events
      Enabler.addEventListener(se.COLLAPSE, () => eventDispatcher.dispatchEvent(Events.COLLAPSE));
      Enabler.addEventListener(se.COLLAPSE_FINISH, () => eventDispatcher.dispatchEvent(Events.COLLAPSE_FINISH));
      Enabler.addEventListener(se.COLLAPSE_START, () => eventDispatcher.dispatchEvent(Events.COLLAPSE_START));

      /**
       * Dispatched when the creative has begun expanding. This gets dispatched when a user calls
       * studio.Enabler#requestExpand() or when the rendering environment has initiated expanding the creative.
       */
      Enabler.addEventListener(se.EXPAND_START, () => eventDispatcher.dispatchEvent(Events.EXPAND_START));

      /**
       * Dispatched when the creative has finished expanding.
       */
      Enabler.addEventListener(se.EXPAND_FINISH, () => eventDispatcher.dispatchEvent(Events.EXPAND_FINISH));

      /**
       * Dispatched when the creative should begin collapsing from fullscreen state to collapsed state.
       */
      Enabler.addEventListener(se.FULLSCREEN_COLLAPSE_START, () => eventDispatcher.dispatchEvent(Events.FULLSCREEN_COLLAPSE_START));

      /**
       * Dispatched when the creative has finished collapsing from fullscreen state to collapsed state.
       */
      Enabler.addEventListener(se.FULLSCREEN_COLLAPSE_FINISH, () => eventDispatcher.dispatchEvent(Events.FULLSCREEN_COLLAPSE_FINISH));

      Enabler.addEventListener(se.FULLSCREEN_EXPAND_FINISH, () => eventDispatcher.dispatchEvent(Events.FULLSCREEN_EXPAND_FINISH));
      Enabler.addEventListener(se.FULLSCREEN_EXPAND_START, () => eventDispatcher.dispatchEvent(Events.FULLSCREEN_EXPAND_START));
    })

    prom = prom.then(() => eventDispatcher);
  }

  return prom;
}
