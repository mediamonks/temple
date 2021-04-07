class Animation {
  constructor ()
  {
    this.timeline = gsap.timeline();

    // do some animation stuff
    this.timeline.to('')
  }

  ctaRollOver(){
    const ctaRollOver = gsap.timeline();

    // do some animation stuff
    ctaRollOver.to('')
  }

  play(){
    this.timeline.play();
  }
}

export default Animation;

