export default async function untilEnablerIsInitialized(Enabler = window.Enabler) {
  return new Promise(resolve => {
    if (!Enabler.isInitialized()) {
      Enabler.addEventListener(studio.events.StudioEvent.INIT, resolve);
    } else {
      resolve();
    }
  });
}
