import { DataBlock } from "./datablock.mjs";

export class Node extends DataBlock {
  constructor(data, parent) {
    super(data.id);

    this.name = data.name || `Node`;
    this.type = data.type || `unknown`;
    this.posX = data.posX || 0;
    this.posY = data.posY || 0;
    this.outputs = [];
    this.group = parent.id;
  }
}

export class NodeGroup extends DataBlock {
  constructor(data) {
    super(data.id);

    this.name = data.name || `Node Group 1`;
    this.nodes = [];

    if (data.nodes) for (const cData of data.nodes) {
      this.nodes.push(new Node(cData, this));
    }
  }
}

export class NodeConnection extends DataBlock {
  constructor(data) {
    super(data.id);

    this.destination = data.destination || null;
  }
}