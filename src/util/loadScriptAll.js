import loadScript from './loadScript';
import loadAll from './loadAll';

export default function loadScriptAll(urls, sequential = false) {
  return loadAll(urls, sequential, loadScript);
}
