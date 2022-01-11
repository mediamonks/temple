import loadImage from './loadImage';

/**
 * Will add canvas elements to the wrapper that are masked by the png images
 * @param {array} config
 *
 * @example
 *  masker([
 *      ['./bg.jpg', './bg_transparent_white_small.png'],
 *      ['./bg.jpg', './flame_mask_small.png'],
 *      ['./bg.jpg', './girl_mask_small.png']
 *   ], document.body.querySelectorAll('.wrapper'));
 *
 * @param {HTMLElement} wrapper
 * @return {Promise<unknown>}
 */
export default function masker(config, wrapper) {
  return new Promise(function(resolve) {
    const images = config
      .reduce(function(acc, curr) {
        acc.push(...curr);
        return acc;
      }, [])
      .filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

    Promise.all(images.map(loadImage))
      .then(images =>
        config.map(items => items.map(item => images.find(img => img.dataset.src === item))),
      )
      .then(mapped => {
        mapped = mapped.map(([img, mask]) => {
          const canvas = document.createElement('canvas');
          let width = (canvas.width = img.width);
          let height = (canvas.height = img.height);

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.drawImage(mask, 0, 0, width, height);

          return canvas;
        });

        mapped.forEach(canvas => wrapper.appendChild(canvas));
        return mapped;
      })
      .then(resolve);
  });
}
