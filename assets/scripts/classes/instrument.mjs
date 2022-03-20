import { NodeMap } from "./nodeMap.mjs";

export class Instrument {
  constructor(data) {
    this.name = `Untitled Instrument`;
    this.nodes = new NodeMap(data.nodes);
  }

  toJSON() {
    return {
      name: this.name,
      nodes: this.nodes.toJSON()
    };
  }
}