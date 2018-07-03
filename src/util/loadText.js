/**
 *
 * @param src
 * @return {Promise<string>}
 */
export default function loadText(src) {
  return fetch(src).then(response => response.text());
}
