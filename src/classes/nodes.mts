import { DataBlock } from "./datablock.mjs";

interface NodeOptions extends DataBlock {
  name?: string,
  type?: string,
  posX?: number,
  posY?: number,
  outputs?: NodeConnection[]
}
export default class Node extends DataBlock {

  public name: string;
  public type: string;
  public posX: number;
  public posY: number;
  public outputs: NodeConnection[];
  public group: string;

  constructor(data: NodeOptions, parent: NodeGroup) {
    super(data.id);

    this.name = data.name ?? `Node`;
    this.type = data.type ?? `unknown`;
    this.posX = data.posX ?? 0;
    this.posY = data.posY ?? 0;
    this.outputs = [];
    this.group = parent.id;
  }
}

interface NodeGroupOptions extends DataBlock {
  name?: string,
  nodes?: Node[]
}
export class NodeGroup extends DataBlock {

  public name: string;
  public nodes: Node[];

  constructor(data: NodeGroupOptions) {
    super(data.id);

    this.name = data.name ?? `Node Group 1`;
    this.nodes = [];

    if (data.nodes) for (const cData of data.nodes) {
      this.nodes.push(new Node(cData, this));
    }
  }
}

interface NodeConnectionOptions extends DataBlock {
  destination?: Node | null 
}
export class NodeConnection extends DataBlock {

  public destination: Node | null;

  constructor(data: NodeConnectionOptions) {
    super(data.id);

    this.destination = data.destination || null;
  }
}