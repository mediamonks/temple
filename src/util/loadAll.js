import load from './load';

export default function loadAll(urls, sequential = false, loader = load) {
  let next = Promise.resolve(true);
  let result = [];
  if (sequential) {
    urls.forEach((url, index) => {
      next = next.then(value => {
        result[index] = value;
        return load(url);
      });
    });
  }

  return Promise.all(urls.map(url => loader(url)));
}
