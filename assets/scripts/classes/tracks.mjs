import { NSDataType, NSDataCollection } from "./baseClass.mjs";

export class Track extends NSDataType {
  constructor(data) {
    super(data.id);

    this.solo = data.solo || false;
    this.muted = data.muted || false;
    this.volume = data.volume || 100;
    this.pan = data.pan || 50;
    this.timeline = new NSDataCollection(TrackSequence);
    this.instrument = data.instrument || null;

    if (data.timeline) for (const cData of data.timeline) {
      this.timeline.add(cData);
    }
  }
}

export class TrackSequence extends NSDataType {
  constructor(data) {
    super(data.id);

    this.position = data.position || 0;
    this.pattern = data.pattern || null;
  }
}