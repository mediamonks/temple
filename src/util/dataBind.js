import makeObservable from './makeObservable';

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

/**
 *
 * @param {object} model
 * @param {HTMLElement} element
 * @param {boolean} isObservable
 */
function dataBind(model, element, isObservable = false) {
  const elements = element.querySelectorAll('[data-bind]');

  if (isObservable) {
    let { observable: model, dispatcher } = makeObservable(model);

    elements.forEach(el => {
      const data = getObject(el.getAttribute('data-bind'));

      dispatcher.addEventListener(data.path.join('.'), () =>
        updateElement(data.type, getValue(model, data.path), el),
      );
    });

    return { model, dispatcher };
  } else {
    elements.forEach(el => {
      const data = getObject(el.getAttribute('data-bind'));

      updateElement(data.type, getValue(model, data.path), el);
    });
  }

  return { model };
}

function updateElement(type, val, element) {
  switch (type) {
    case 'text': {
      element.innerText = val;
      break;
    }

    case 'html': {
      element.innerHTML = val;
      break;
    }

    case 'href':
    case 'src': {
      element[data.type] = val;
      break;
    }

    default: {
      // match anything with style.*
      const match = /style\.([\w-]+)/.exec(type);
      if (match && element.style[match[1]]) {
        element.style[match[1]] = val;
      } else {
        element.setAttribute(type, val);
      }

      break;
    }
  }
}

export default dataBind;
