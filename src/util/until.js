export default function until(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
