export default class CreateJSModule extends Module {
  constructor() {
    super();

    this.version = '1.4.0';
    this.controller = this;
    this.children = [];
    this.childCount = -1;
    this.canvas =
      typeof arguments[0].canvas == 'string'
        ? document.querySelector(arguments[0].canvas) || document.getElementById(arguments[0].canvas)
        : arguments[0].canvas;
    this.libs = arguments[0].lib || ['lib'];
    this.lib = arguments[0].lib || ['lib'];
    this.src = arguments[0].src;
    this.child = arguments[0].child;

    if (!this.src && !this.child) {
      console.error(
        'CreateJSModule needs a canvas element and a library source path. {canvas:".canvas", src:"js/export.js"}'
      );
      return;
    }

    this.fps = arguments[0].fps;
    this.spriteimage = arguments[0].spriteimage;
    this.manifest = arguments[0].manifest || [];
    this.main = !arguments[0].child;
    this.size = arguments[0].size;
    this.childControl = [];

    if (typeof this.src == 'string') this.src = [this.src];
    if (typeof this.lib == 'string') this.lib = [this.lib];
    if (typeof this.spritesheet == 'string') this.spritesheet = [this.spritesheet];
    if (typeof this.spriteimage == 'string') this.spriteimage = [this.spriteimage];

    if (typeof createjs == 'undefined') {
      this.getCreateJS();
    } else {
      this.initCreateJSModule();
    }
  }

  getCreateJS() {
    var cjs = 'https://s0.2mdn.net/ads/studio/cached_libs/createjs_2015.11.26_54e1c3722102182bb133912ad4442e19_min.js';
    loadScript(cjs, this.initCreateJSModule.bind(this));
  }

  initCreateJSModule() {
    if (!this.src) {
      this.lib = undefined;
      this.handleComplete();
      return;
    }

    this.srcs = [];
    this.ids = [];

    for (var i = 0; i < this.src.length; i++) {
      this.srcs[i] = this.src[i];
      this.ids[i] = this.src[i].replace('.js', '').split('/');
      this.ids[i] = this.ids[i][this.ids[i].length - 1];
    }

    temple.utils.loadScript(this.srcs, this.initCreateJS.bind(this));
  }

  initCreateJS() {
    var temp = [];
    for (i = 0; i < this.lib.length; i++) {
      temp[i] = window[this.lib[i]];

      var id = temp[i].ssMetadata[0] ? temp[i].ssMetadata[0].name.replace('_atlas_', '') : this.ids[i];
      temp[i]._root = temp[i]['_' + id] || temp[i][id];
    }

    this.lib = temp;

    if (this.spriteimage) {
      this.spriteimage.forEach(
        function() {
          this.lib[arguments[1]].properties.manifest[0].src = arguments[0] + '?' + new Date().getTime();
        }.bind(this)
      );
    }

    var loader = new createjs.LoadQueue(false);
    loader.addEventListener('fileload', this.handleFileLoad);
    loader.addEventListener('complete', this.handleComplete.bind(this));

    for (i = 0; i < this.lib.length; i++) {
      this.lib[i].properties.manifest.forEach(
        function() {
          arguments[0].lib = this.libs[i];
        }.bind(this)
      );
      this.manifest = this.manifest.concat(this.lib[i].properties.manifest);
    }

    if (!this.manifest.length) {
      this.handleComplete();
      return;
    }

    loader.loadManifest(this.manifest);
  }

  handleFileLoad(e) {
    if (e.item.type == 'image') {
      images[e.item.id] = e.result;
    }
  }

  handleComplete(e) {
    if (e) {
      var queue = e.target;
      for (i = 0; i < this.lib.length; i++) {
        for (t = 0; t < this.lib[i].ssMetadata.length; t++) {
          s = this.lib[i].ssMetadata[t];
          ss[s.name] = new createjs.SpriteSheet({
            images: [queue.getResult(s.name)],
            frames: s.frames,
          });
        }
      }
    }

    if (this.canvas) {
      this.stage = new createjs.Stage(this.canvas);
      this.container = new createjs.Container();
      this.stage.addChild(this.container);

      if (this.size) {
        this.canvas.setAttribute('width', this.size.width);
        this.canvas.setAttribute('height', this.size.height);
      } else {
        this.canvas.setAttribute('width', this.lib[0].properties.width);
        this.canvas.setAttribute('height', this.lib[0].properties.height);
      }

      var r = this.canvas.getBoundingClientRect();
      this.canvas.style.width = r.width + 'px';
      this.canvas.style.height = r.height + 'px';
      this.canvas.width = r.width * window.devicePixelRatio;
      this.canvas.height = r.height * window.devicePixelRatio;
      this.canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
      this.container.scaleX = window.devicePixelRatio;
      this.container.scaleY = window.devicePixelRatio;

      if (!this.child) createjs.Ticker.setFPS(this.fps || this.lib[0].properties.fps || 30);
    }

    this.done();
  }

  createChild(canvas, mc, resize) {
    var c = new temple.modules.Child(canvas, mc, this.controller, resize);
    this.children.push(c);
    return c;
  }

  addChild(child) {
    this.container.addChild(child);
    this.update();
  }

  removeChild(child) {
    this.container.removeChild(child);
    this.update();
  }

  setChild(child) {
    this.childControl.push(child);
  }

  start(e) {
    createjs.Ticker.addEventListener('tick', this.update.bind(this));
  }

  stop(e) {
    createjs.Ticker.removeAllEventListeners('tick');
    this.stage.enableDOMEvents(false);
  }

  update(e) {
    if (this.main && this.childControl.length) {
      for (var i = 0; i < this.childControl.length; i++) {
        this.childControl[i].stage.update();
      }
    }

    if (!this.child) {
      this.stage.update();
    }
  }
}
