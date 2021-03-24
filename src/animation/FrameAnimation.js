// eslint-disable-next-line import/no-unresolved
import { gsap } from 'gsap';

const methodNameMatch = /(frame)(\d+)(In|Out|)$/;

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
        let [_, _1, frameNumber, type] = result;
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

  /**
   * @return gsap.core.Timeline
   * @private
   */
  __getTimeline() {
    const animations = this.__gatherAnimation();
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

  play() {
    const timeline = this.__getTimeline();
    timeline.play();

    return timeline;
  }
}
