import { NSDataType, NSDataCollection } from "./baseClass.mjs";

export class Node extends NSDataType {
  constructor(data, parent) {
    super(data.id);

    this.name = data.name || `Node`;
    this.type = data.type || `unknown`;
    this.posX = data.posX || 0;
    this.posY = data.posY || 0;
    this.outputs = new NSDataCollection(NodeConnection);
    this.group = parent.id;
  }
}

export class NodeGroup extends NSDataType {
  constructor(data) {
    super(data.id);

    this.name = data.name || `Node Group 1`;
    this.nodes = new NSDataCollection(Node);

    if (data.nodes) for (const cData of data.nodes) {
      this.nodes.add(cData, this);
    }
  }
}

export class NodeConnection extends NSDataType {
  constructor(data) {
    super(data.id);

    this.destination = data.destination || null;
  }
}