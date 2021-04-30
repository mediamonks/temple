/**
 * Will travel through a object and when it finds a leaf will call the function from the second argument
 *
 * @param {object} source
 * @param {function(leafValue: any, leafName: any, source: object, currPath: Array:string) => void} fn
 * @param {number} maxNesting
 * @param {Array<string>} path
 */
function traverseObject(source, fn, maxNesting = 10, path = []) {
  if (maxNesting < 0) {
    return;
  }

  for (var propName in source) {
    const traversedPath = [...path];
    if (source.hasOwnProperty(propName)) {
      traversedPath.push(propName);
      if (typeof source[propName] === 'object') {
        traverseObject(source[propName], fn, maxNesting - 1, traversedPath);
      } else {
        fn(source[propName], propName, source, traversedPath);
      }
    }
  }
}

export default traverseObject;
