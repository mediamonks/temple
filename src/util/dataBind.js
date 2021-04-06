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
    const val = getValue(model, data.path);

    switch (data.type) {
      case 'text': {
        el.innerText = val;
        break;
      }

      case 'html': {
        el.innerHTML = val;
        break;
      }

      case 'href': {
        el.href = val;
        break;
      }

      case 'src': {
        el.src = val;
        break;
      }

      default: {
        // match anything with style.*
        const match = /style\.([\w-]+)/.exec(data.type);
        if (match && el.style[match[1]]) {
          el.style[match[1]] = val;
        } else {
          el.setAttribute(data.type, getValue(model, data.path));
        }

        break;
      }
    }
  });
}

export default dataBind;
