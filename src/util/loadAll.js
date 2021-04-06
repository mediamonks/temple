import load from './load';

export default function loadAll(urls, sequential = false, loader = load) {
  if (sequential) {
    return urls.reduce((prom, url) => prom.then(() => loader(url)), Promise.resolve(true));
  }

  return Promise.all(urls.map(url => loader(url)));
}
