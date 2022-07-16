import { NSDataType, NSDataCollection } from "./baseClass.mjs";

export class Pattern extends NSDataType {
  constructor(data) {
    super(data.id);

    this.name = data.name || `Pattern`;
    this.notes = new NSDataCollection(Note);

    if (data.notes) for (const cData of data.notes) {
      this.notes.add(cData);
    }
  }
}

export class Note extends NSDataType {
  constructor(data) {
    super(data.id);

    this.position = data.position || 0;
    this.length = data.length || 1;
    this.bend = new NSDataCollection(NoteBend);

    if (data.bend) for (const cData of data.bend) {
      this.bend.add(cData);
    }
  }
}

export class NoteBend extends NSDataType {
  constructor(data) {
    super(data.id);

    this.position = data.position || 0;
    this.length = data.length || 1;
    this.amount = data.amount || 0;
  }
}