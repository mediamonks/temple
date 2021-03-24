import loadScript from './loadScript';
import loadImage from './loadImage';
import loadText from './loadText';

const regJson = /\.json$/;
// const regText = /\.(html|text|md|MD)$/;
const regJs = /\.js$/;
const regBitmap = /\.(png|gif|jpg|jpeg|svg)$/;

export default function load(url) {
  switch (true) {
    case regJson.test(url): {
      return loadScript(url);
    }

    case regJs.test(url): {
      return loadScript(url);
    }

    case regBitmap.test(url): {
      return loadImage(url);
    }

    default: {
      // case regText.test(url): {
      return loadText(url);
    }
  }
}
