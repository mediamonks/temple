/**
 *
 * @param v
 * @return {string|boolean}
 */
export default function getQueryVar(v) {
  const q = window.location.search.substring(1);
  const vs = q.split('&');
  for (let i = 0; i < vs.length; i++) {
    const p = vs[i].split('=');
    if (p[0] === v) {
      return p[1];
    }
  }
  return false;
}
