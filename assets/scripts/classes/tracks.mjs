import { DataBlock } from "./baseClass.mjs";

export class Track extends DataBlock {
  constructor(data) {
    super(data.id);

    this.solo = data.solo || false;
    this.muted = data.muted || false;
    this.volume = data.volume || 100;
    this.pan = data.pan || 50;
    this.timeline = [];
    this.instrument = data.instrument || null;

    if (data.timeline) for (const cData of data.timeline) {
      this.timeline.push(new TrackSequence(cData));
    }
  }
}

export class TrackSequence extends DataBlock {
  constructor(data) {
    super(data.id);

    this.position = data.position || 0;
    this.pattern = data.pattern || null;
  }
}