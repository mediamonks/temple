export default function fitText(copyElement) {
  TweenMax.set(copyElement, { clearProps: 'fontSize, lineHeight' });
  var p = copyElement.parentElement;
  var s = Number(
    window
      .getComputedStyle(p, null)
      .getPropertyValue('font-size')
      .replace('px', ''),
  );
  var l =
    Number(
      window
        .getComputedStyle(p, null)
        .getPropertyValue('line-height')
        .replace('px', ''),
    ) || s + 1;
  var targetWidth = Number(
    window
      .getComputedStyle(copyElement, null)
      .getPropertyValue('width')
      .replace('px', ''),
  );
  var parentWidth = Number(
    window
      .getComputedStyle(p, null)
      .getPropertyValue('width')
      .replace('px', ''),
  );
  var targetHeight = Number(
    window
      .getComputedStyle(copyElement, null)
      .getPropertyValue('height')
      .replace('px', ''),
  );
  var parentHeight = Number(
    window
      .getComputedStyle(p, null)
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
      if(s < 1 || l < 1){
        return;
      }
      s -= 0.2;
      l -= 0.2;
      copyElement.style.fontSize = s + 'px';
      copyElement.style.lineHeight = l + 'px';
    }
  }
}
