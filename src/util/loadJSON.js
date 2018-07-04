/**
 * Load a JSON file.
 * @param url
 * @return {Promise<any>}
 */
export default function loadJSON(url) {
  return fetch(url).then(response => response.json());
}
