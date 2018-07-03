
let _uuid = new Date().getTime();
export default function uuid() {
	return (_uuid++).toString(16);
}