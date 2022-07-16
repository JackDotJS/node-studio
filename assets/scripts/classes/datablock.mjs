export class DataBlock {
  constructor(id) {
    this.id = id || window.crypto.randomUUID();
  }
}

export function indexInArray(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }

  return -1;
}