/**
 * Load a JSON file.
 *
 * @method temple.utils.loadJSON
 * @param {String || Array} url JSON file url. A string array of url's also possible.
 * @param {Function} [callback] Callback function when file loaded.
 * @param {Function} [error] Error function when file not loaded.
 * @param {Boolean} [jsonString] Set to true to return an unparsed JSON string.
 */
export default function loadJSON(url) {
  return fetch(url).then(response => response.json());
}
