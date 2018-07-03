export default class Child {
  constructor(canvas, mc, controller, resize) {
    this.controller = controller;
    this.controller.childCount++;
    this.id = this.controller.childCount;
    this.canvas =
      typeof canvas == 'string' ? document.querySelector(canvas) || document.getElementById(canvas) : canvas;
    this.stage = new createjs.Stage(this.canvas);
    this.container = new createjs.Container();
    this.mc = new this.controller.lib[0][mc](null, null, true); //always need to be a NEW?!?!?!?!?!
    this.totalTime = this.mc.duration / this.controller.lib[0].properties.fps;
    this.resize = resize != undefined ? resize : true;

    if (this.resize) {
      this.canvas.width = parseInt(window.getComputedStyle(this.canvas, null).getPropertyValue('width')); // if the canvas doesn't have an inline style it will not scale correctly because by default the canvas is 300px x 150px
      var scale = this.canvas.width / this.mc.nominalBounds.width;
      this.canvas.height = scale * this.mc.nominalBounds.height;
      this.stage.scaleX = this.stage.scaleY = scale;
      this.stage.y = this.canvas.height / 2 - this.mc.nominalBounds.height / 2 * scale;
    } else {
      this.canvas.setAttribute('width', this.controller.lib[0].properties.width);
      this.canvas.setAttribute('height', this.controller.lib[0].properties.height);
    }

    this.container.addChild(this.mc);

    this.stage.addChild(this.container);

    createjs.Ticker.setFPS(this.controller.lib[0].properties.fps);
    this.stage.update();
  }

  start(e) {
    createjs.Ticker.addEventListener('tick', this.update.bind(this));
  }

  stop(e) {
    createjs.Ticker.removeAllEventListeners('tick');
    this.stage.enableDOMEvents(false);
  }

  update(e) {
    this.stage.update();
  }
}
