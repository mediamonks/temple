export default function getQueryVar(v) {
  var q = window.location.search.substring(1);
  var vs = q.split('&');
  for (var i = 0; i < vs.length; i++) {
    var p = vs[i].split('=');
    if (p[0] == v) {
      return p[1];
    }
  }
  return false;
}
