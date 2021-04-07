import Banner from './Banner';
import Animation from './Animation';

const banner = new Banner(
  document.querySelector('body'),
  new Animation()
);

banner.start();
