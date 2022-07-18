import { DataBlock } from "./datablock.mjs";

export class Pattern extends DataBlock {
  constructor(data) {
    super(data.id);

    this.name = data.name || `Pattern`;
    this.notes = [];

    if (data.notes) for (const cData of data.notes) {
      this.notes.push(new Note(cData));
    }
  }
}

export class Note extends DataBlock {
  constructor(data) {
    super(data.id);

    this.position = data.position || 0;
    this.length = data.length || 1;
    this.bend = [];

    if (data.bend) for (const cData of data.bend) {
      this.bend.push(new NoteBend(cData));
    }
  }
}

export class NoteBend extends DataBlock {
  constructor(data) {
    super(data.id);

    this.position = data.position || 0;
    this.length = data.length || 1;
    this.amount = data.amount || 0;
  }
}