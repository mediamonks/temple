/**
 *
 * @type {{
 *  isMobile: boolean
 *  isiOS: boolean
 *  isiOS9up: boolean
 *  isiPad: boolean
 *  isSafari: boolean
 * }}
 */
const Browser = {};
Browser.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent,
);
Browser.isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
Browser.isiOS9up = Browser.isiOS && navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1] > 9;
Browser.isiPad = /iPad/.test(navigator.userAgent);
Browser.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default Browser;
