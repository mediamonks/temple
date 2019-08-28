import loadAll from './loadAll';

/**
 * Will search for all child elements with a attribute data-src and will load it change it to .src,
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export default async function politeLoadImages(element) {
  const imageList = Array.from(element.querySelectorAll('img[data-src]'));
  const imageUrlList = imageList.map(img => img.getAttribute('data-src'));
  const result = await loadAll(imageUrlList);

  result.forEach((img, index) => {
    imageList[index].src = img.src;
  });

  while (result.length) {
    result.pop();
  }
}
