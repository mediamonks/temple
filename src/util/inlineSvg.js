import loadText from './loadText';

/**
 *
 * @param {HTMLElement} container
 * @return {Promise<void>}
 */
function inlineSvg(container) {
  let elements = Array.from(container.querySelectorAll('img[svg]'));
  elements = [...elements, ...Array.from(container.querySelectorAll('img[inline]'))];

  elements.forEach(img => {
    if (!img.src) {
      throw new Error('img element with missing src attribute.');
    }
  });

  return Promise.all(elements.map(img => loadText(img.src))).then(svgList => {
    svgList.forEach((svgText, index) => {
      const el = elements[index];
      const { id, className } = el;
      const div = document.createElement('div');
      const parent = el.parentNode;

      parent.appendChild(div);
      div.innerHTML = svgList[index];
      div.firstChild.id = id;
      div.firstChild.setAttribute('class', className);

      parent.replaceChild(div.firstChild, el);
      parent.removeChild(div);
    });
  });
}

export default inlineSvg;
