function getObject(str) {
  let [type, path] = str.split(':');

  type = type.trim();
  path = path.trim().split('.');

  return {
    type,
    path,
  };
}

function getValue(model, path) {
  path.forEach(item => {
    if (model[item]) {
      model = model[item];
    }
  });

  if (typeof model !== 'string') {
    throw new Error(`defined path is wrong ${path.join('.')}`);
  }

  return model;
}

function dataBind(model, element) {
  const elements = element.querySelectorAll('[data-bind]');

  elements.forEach(el => {
    const data = getObject(el.getAttribute('data-bind'));

    switch (data.type) {
      case 'text': {
        el.innerText = getValue(model, data.path);
        break;
      }

      case 'html': {
        el.innerHTML = getValue(model, data.path);
        break;
      }

      case 'href': {
        el.href = getValue(model, data.path);
        break;
      }

      case 'src': {
        el.src = getValue(model, data.path);
        break;
      }

      default: {
        el.setAttribute(data.type, getValue(model, data.path));
        break;
      }
    }
  });
}

export default dataBind;
