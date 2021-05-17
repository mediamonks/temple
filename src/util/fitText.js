/**
 *
 * @param {Array<HTMLElement>} copyElements
 */
export default function fitText(...copyElements) {
  copyElements = copyElements.flat();

  copyElements.forEach(copyElement => {
    if(window.gsap){
      window.gsap.set(copyElement, { clearProps: 'fontSize, lineHeight' });
    }

    const { parentElement } = copyElement;
    let fontSize = Number(
      window
        .getComputedStyle(parentElement, null)
        .getPropertyValue('font-size')
        .replace('px', ''),
    );
    let lineHeight =
      Number(
        window
          .getComputedStyle(parentElement, null)
          .getPropertyValue('line-height')
          .replace('px', ''),
      ) || fontSize + 1;
    const targetWidth = Number(
      window
        .getComputedStyle(copyElement, null)
        .getPropertyValue('width')
        .replace('px', ''),
    );
    const parentWidth = Number(
      window
        .getComputedStyle(parentElement, null)
        .getPropertyValue('width')
        .replace('px', ''),
    );
    const targetHeight = Number(
      window
        .getComputedStyle(copyElement, null)
        .getPropertyValue('height')
        .replace('px', ''),
    );
    const parentHeight = Number(
      window
        .getComputedStyle(parentElement, null)
        .getPropertyValue('height')
        .replace('px', ''),
    );

    if (targetHeight > parentHeight || targetWidth > parentWidth) {
      while (
        Number(
          window
            .getComputedStyle(copyElement, null)
            .getPropertyValue('height')
            .replace('px', ''),
        ) > parentHeight ||
        Number(
          window
            .getComputedStyle(copyElement, null)
            .getPropertyValue('width')
            .replace('px', ''),
        ) > parentWidth
      ) {
        if (fontSize < 1 || lineHeight < 1) {
          return;
        }
        fontSize -= 0.2;
        lineHeight -= 0.2;
        copyElement.style.fontSize = `${fontSize}px`;
        copyElement.style.lineHeight = `${lineHeight}px`;
      }
    }
  });
}
