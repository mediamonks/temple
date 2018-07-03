export default function debug(e, c, v) {
  if (console.debug && (!temple.isLive || temple.config.debug === true)) {
    console.debug(
      '%c[' + temple.type + ']%s',
      'font-weight:bold;color:' + (typeof c == 'string' ? c : temple.color) + ';',
      ' ' + (v || temple.version),
      ':',
      e || '',
      typeof c != 'string' && typeof c != 'undefined' ? c : ''
    );
  }
}
