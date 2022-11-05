import { DataBlock } from "./datablock.js";
import { NodeGroup } from "./nodes.js";
import Pattern from "./patterns.js";

interface TrackOptions extends DataBlock {
  solo: boolean,
  muted: boolean,
  volume: number,
  pan: number,
  timeline: TrackSequence[],
  instrument: NodeGroup
}

export default class Track extends DataBlock {

  public solo: boolean;
  public muted: boolean;
  public volume: number;
  public pan: number;
  public timeline?: TrackSequence[];
  public instrument: NodeGroup;

  constructor(data: TrackOptions) {
    super(data.id);

    this.solo = data.solo ?? false;
    this.muted = data.muted ?? false;
    this.volume = data.volume ?? 100;
    this.pan = data.pan ?? 50;
    this.timeline = [];
    this.instrument = data.instrument ?? null;

    if (data.timeline) for (const cData of data.timeline) {
      this.timeline.push(new TrackSequence(cData));
    }
  }
}


interface TrackSequenceOptions extends DataBlock {
  position: number,
  pattern: Pattern
}

export class TrackSequence extends DataBlock {

  public position: number;
  public pattern: Pattern;

  constructor(data: TrackSequenceOptions) {
    super(data.id);

    this.position = data.position || 0;
    this.pattern = data.pattern || null;
  }
}