export class DataBlock {

  public readonly id: string;

  constructor(id?: string) {
    this.id = id ?? window.crypto.randomUUID();
  }
}

export function indexInArray(arr: Array<DataBlock>, id: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }

  return -1;
}
