// temple.modules.dc = temple.modules.dc || {};
export default class DynamicModule extends Module {
  constructor(data) {
    super();
    this.version = '1.1.1';
    this.index = data.sheetIndex || 0;
    this._data = this.data = data.data || data;

    Enabler.setDevDynamicContent(this.data);

    // @todo Where does this come from?
    this.data = dynamicContent;
    this._data = dynamicContent;

    for (var k in this.data) {
      if (k != '_profileid') break;
    }

    this.data = this.data[k][this.index];

    this.setContent();
  }

  initDynamicModule() {
    this.done();
  }

  setContent() {
    this.dynamicElements = document.querySelectorAll('[data-dynamic]');
    if (document.body.hasAttribute('data-dynamic-exit')) {
      this.exitURLs = this.parseDataArray('exit');
    }
    if (document.body.hasAttribute('data-dynamic-video')) {
      temple.config.video.sources = this.parseDataArray('video');
    }
    for (var i = 0; i < this.dynamicElements.length; i++) {
      var d = this.dynamicElements[i].getAttribute('data-dynamic');

      d = eval('this.data.' + d);
      if (this.dynamicElements[i].nodeName == 'IMG') {
        this.imagesToLoad = this.imagesToLoad + 1 || 1;
        this.dynamicElements[i].onload = this.imageLoaded.bind(this);
        this.dynamicElements[i].src = d;
      } else {
        this.dynamicElements[i].innerHTML = d;
      }
    }
    if (!this.imagesToLoad) this.initDynamicModule();
  }

  imageLoaded(e) {
    this.imagesLoaded = this.imagesLoaded + 1 || 1;
    if (this.imagesLoaded == this.imagesToLoad) {
      this.initDynamicModule();
    }
  }

  getContent(a) {
    return this._data[a][0];
  }

  parseDataArray(a) {
    var s = [];
    var v = document.body.getAttribute('data-dynamic-' + a);
    v = v.split(',');
    for (var i = 0; i < v.length; i++) {
      var d = eval('this.data.' + v[i]).split(',');
      s = s.concat(d);
    }
    return s;
  }
}
