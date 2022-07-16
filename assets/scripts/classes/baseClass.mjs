export class DataBlock {
  constructor(id) {
    this.id = id || window.crypto.randomUUID();
  }
}