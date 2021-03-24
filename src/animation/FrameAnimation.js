const methodNameMatch = /(frame)(\d+)(In|Out|)$/;

export default class FrameAnimation {
  /**
   * @return Array<{in: Timeline | null, base: Timeline | null, out: Timeline | null}>
   * @private
   */
  __gatherAnimations() {
    const scope = this;
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    const data = [];
    names.forEach(name => {
      const result = methodNameMatch.exec(name);
      if (result !== null) {
        let [_, _, frameNumber, type] = result;
        frameNumber = parseInt(frameNumber, 10);
        type = `${type}`.toLowerCase();

        if (type === '') {
          type = 'base';
        }

        const timeline = scope[name]();

        if (timeline) {
          if (!data[frameNumber]) {
            data[frameNumber] = { in: null, base: null, out: null };
          }

          data[frameNumber][type] = timeline;
        }
      }
    });

    return data;
  }

  play() {
    const animations = this.__gatherAnimations();
    const timeline = gsap.timeline();

    for (let i = 0; i < animations.length; i++) {
      if (animations[i]) {
        if (animations[i].in) {
          timeline.add(animations[i].in);
        }
        if (animations[i].base) {
          timeline.add(animations[i].base);
        }
        if (animations[i].out) {
          timeline.add(animations[i].out);
        }
      }
    }

    return timeline;
  }
}
