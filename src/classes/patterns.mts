import { DataBlock } from "./datablock.mjs";

interface PatternOptions extends DataBlock {
  name?: string,
  notes?: Note[]
}
export default class Pattern extends DataBlock {

  public name: string;
  public notes: Note[];

  constructor(data: PatternOptions) {
    super(data.id);

    this.name = data.name ?? `Untitled Pattern`;
    this.notes = [];

    if (data.notes) for (const cData of data.notes) {
      this.notes.push(cData);
    }
  }
}

export interface INoteBend {
  position: number,
  length: number,
  amount: number
}
interface NoteOptions extends DataBlock {
  position?: number,
  length?: number,
  bend?: INoteBend[]
}
export class Note extends DataBlock {

  public position: number;
  public length: number;
  public bend: INoteBend[];

  constructor(data: NoteOptions) {
    super(data.id);

    this.position = data.position ?? 0;
    this.length = data.length ?? 1;
    this.bend = [];

    if (data.bend) for (const cData of data.bend) {
      this.bend.push(cData);
    }
  }
}