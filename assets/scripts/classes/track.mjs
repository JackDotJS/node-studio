export class Track {
  constructor() {
    this.name = `Untitled Track`;
    this.volume = 100;
    this.pan = 50;
    // todo
  }

  toJSON() {
    return {
      name: this.name,
      volume: this.volume,
      pan: this.pan
    };
  }
}