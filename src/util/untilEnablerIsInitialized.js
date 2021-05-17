export default async function untilEnablerIsInitialized() {
  return new Promise(resolve => {
    if (!window.Enabler.isInitialized()) {
      window.Enabler.addEventListener(studio.events.StudioEvent.INIT, resolve);
    } else {
      resolve();
    }
  });
}
