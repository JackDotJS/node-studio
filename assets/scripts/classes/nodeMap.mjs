export class NodeMap {
  constructor(data) {
    this.map = [];
  }

  toJSON() {
    return {
      map: this.map
    };
  }
}

export function convertProject() {
  // reserved for future use
}