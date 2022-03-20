export class Sequence {
  constructor() {
    this.name = `Untitled Sequence`;
    // todo
  }

  toJSON() {
    return {
      name: this.name
    };
  }
}