import Enabler from 'Enabler';
import Monet from 'Monet';

import '@netflixadseng/wc-monet-integrator';
import '@netflixadseng/wc-netflix-fonts';

import isValidURL from '../../util/isValidURL';
import Browser from '../../util/Browser';
// import Platform from './Platform';
import EventType from '../../event/EventType';
import ConfigComponent from '../ConfigComponent';
import EventDispatcherComponent from '../EventDispatcherComponent';
import PlatformComponent from './PlatformComponent';

/**
 *
 */
export default class MonetPlatformComponent extends PlatformComponent {
  static requires = [ConfigComponent, EventDispatcherComponent];
  /**
   *
   * @type {{
   *  rootAssets:Array<{}>
   * }}
   */
  monetData = null;

  async init() {
    await super.init();

    const config = this.getComponent(ConfigComponent).get();

    this.domMonetIntegrator = document.querySelector('monet-integrator');
    let domNetflixFonts = document.querySelector('netflix-fonts');

    if (!this.domMonetIntegrator) {
      this.domMonetIntegrator = document.createElement('monet-integrator');
      this.domMonetIntegrator.setAttribute('dynamic-feed-sheet-name', config.monet.creativeName);
      document.body.appendChild(this.domMonetIntegrator);
    }

    if (!domNetflixFonts) {
      domNetflixFonts = document.createElement('netflix-fonts');
      document.body.appendChild(domNetflixFonts);
    }

    if (this.domMonetIntegrator.hasAttribute('ready')) {
      await this.webComponentReady();
    } else {
      await new Promise(resolve => {
        const callback = () => {
          this.domMonetIntegrator.removeEventListener('ready', callback);
          this.webComponentReady().then(() => {
            resolve();
          });
        };

        this.domMonetIntegrator.addEventListener('ready', callback);
      });
    }

    // add tracking
    const dispatcher = this.getComponent(EventDispatcherComponent);

    dispatcher.addEventListener(EventType.CLICK, event => {
      const src = String(event.target);
      Monet.logEvent('CLICK', {
        src,
        coords: {
          x: event.clientX,
          y: event.clientY,
        },
      });
    });

    dispatcher.addEventListener(EventType.CLICK, event => {
      Monet.logEvent('AD_EXIT', { url: event.url });
    });

    dispatcher.addEventListener(EventType.EXPAND, event => {
      Monet.logEvent('UNIT_RESIZE', {
        type: 'expand',
        Size: {
          width: config.settings.expandable.width,
          height: config.settings.expandable.height,
        },
      });
    });

    dispatcher.addEventListener(EventType.COLLAPSE, event => {
      Monet.logEvent('UNIT_RESIZE', {
        type: 'collapse',
        Size: {
          width: config.size.width,
          height: config.size.height,
        },
      });
    });
  }

  webComponentReady() {
    return this.domMonetIntegrator.getMonetData().then(data => {
      this.monetData = data;
    });
  }

  onStart() {}

  /**
   *
   * @param key
   * @return {*}
   */
  getData(key = null) {
    if (!key) {
      return { ...this.monetData };
    }

    const items = Object.keys(this.monetData.rootAssets);
    let foundIndex = -1;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const [type, name] = item.split('.');
      if (name.indexOf(key) > -1) {
        foundIndex = i;
      }
    }

    if (foundIndex > -1) {
      return this.monetData.rootAssets[items[foundIndex]].value;
    } else {
      return null;
    }
  }

  getLocale() {
    const locale = Monet.getComponentLocale('text.Tune_In');
    return {
      locale,
      language: locale.substr(0, 2),
      country: locale.substr(3, 2),
    };
  }

  gotoExit = () => {
    let url = null;
    const monetData = this.getData();

    if (Browser.isiOS) {
      url = monetData.rootAssets['url.Exit_URL_iOS'].url;
    } else if (Browser.isMobile) {
      url = monetData.rootAssets['url.Exit_URL_Android'].url;
    } else {
      url = monetData.rootAssets['url.Exit_URL_Desktop'].url;
    }

    if (isValidURL(url)) {
      Enabler.exitOverride('Default Exit', url);
    } else {
      Enabler.exitOverride('Default Exit', null);
    }
  };

  setImpressionPixel(type, skills) {
    return Monet.logEvent('MONET_IMPRESSION', { type: type, skills: skills });
  }
}
