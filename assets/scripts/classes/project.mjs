import { Instrument } from "./instrument.mjs";
import { Track } from "./track.mjs";
import { Sequence } from "./sequence.mjs";

export class NodeStudioProject {
  constructor(data) {
    this.format = data.format || 1;
    this.title = data.title || `Untitled`;
    this.author = data.author || `Unknown`;
    this.description = data.description || `No description.`;
    this.tempo = data.tempo || 120;
    this.usesPlugins = data.usesPlugins || false;
    this.instruments = [];
    this.tracks = [];
    this.sequences = [];

    for (const cData of data.instruments) {
      const obj = new Instrument(cData);
      this.instruments.push(obj);
    }

    for (const cData of data.tracks) {
      const obj = new Track(cData);
      this.tracks.push(obj);
    }

    for (const cData of data.sequences) {
      const obj = new Sequence(cData);
      this.sequences.push(obj);
    }
  }

  toJSON() {
    const jsi = [];
    const jst = [];
    const jss = [];

    for (const cData of this.instruments) {
      jsi.push(cData.toJSON());
    }

    for (const cData of this.tracks) {
      jst.push(cData.toJSON());
    }

    for (const cData of this.sequences) {
      jss.push(cData.toJSON());
    }

    return {
      format: this.format,
      title: this.title,
      author: this.author,
      description: this.description,
      tempo: this.tempo,
      instruments: jsi,
      tracks: jst,
      sequences: jss,
      usesPlugins: this.usesPlugins
    };
  }
}