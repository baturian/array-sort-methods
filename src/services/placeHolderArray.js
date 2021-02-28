export default class PlaceHolderArray {
  pArray;
  get array() {
    return this.pArray || [];
  }
  set array(arr) {
    this.pArray = Array.from(arr);
  }
  clean() {
    this.pArray = [];
  }
}
