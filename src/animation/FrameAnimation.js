// eslint-disable-next-line import/no-unresolved
const methodNameMatch = /(frame)(\d+)(In|Out|)$/;

/**
 *
 */
export default class FrameAnimation {
  /**
   * @return Array<{in: gsap.core.Timeline | null, base: gsap.core.Timeline | null, out: gsap.core.Timeline | null}>
   * @private
   */
  __gatherAnimation() {
    const scope = this;
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    const data = [];
    names.forEach(name => {
      const result = methodNameMatch.exec(name);
      if (result !== null) {
        let [frameNumber, type] = result.splice(2);
        frameNumber = parseInt(frameNumber, 10);
        type = `${type}`.toLowerCase();

        if (type === '') {
          type = 'base';
        }

        const method = scope[name];

        if (method) {
          if (!data[frameNumber]) {
            data[frameNumber] = {
              in: null,
              base: null,
              out: null,
            };
          }

          data[frameNumber][type] = method;
        }
      }
    });

    return data;
  }

  /**
   * @return gsap.core.Timeline
   * @private
   */
  __getTimeline(timeline = gsap.timeline()) {
    const animationMethods = this.__gatherAnimation();

    for (let i = 0; i < animationMethods.length; i++) {
      if (animationMethods[i]) {
        if (animationMethods[i].in) {
          const subTimeline = animationMethods[i].in.call(this, timeline);
          if (subTimeline) timeline.add(subTimeline);
        }
        if (animationMethods[i].base) {
          const subTimeline = animationMethods[i].base.call(this, timeline);
          if (subTimeline) timeline.add(subTimeline);
        }
        if (animationMethods[i].out) {
          const subTimeline = animationMethods[i].out.call(this, timeline);
          if (subTimeline) timeline.add(subTimeline);
        }
      }
    }

    return timeline;
  }

  /**
   *
   * @param {gsap.core.Timeline} timeline
   * @return {gsap.core.Timeline}
   */
  play(timeline = gsap.timeline()) {
    if (!this.timeline) {
      this.timeline = this.__getTimeline(timeline);
    }
    this.timeline.play();
  }
}
