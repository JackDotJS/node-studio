import { NodeGroup } from "./nodes.js";
import { Track } from "./tracks.js";
import { Pattern } from "./patterns.js";

export class NodeStudioProject {
  constructor(data = {}) {
    this.format = data.format || 1;
    this.title = data.title || `Untitled Project`;
    this.author = data.author || `Unknown`;
    this.description = data.description || `No description.`;
    this.tempo = data.tempo || 120;
    this.nodeGroups = [];
    this.tracks = [];
    this.patterns = [];
    
    if (data.nodeGroups) for (const cData of data.nodeGroups) {
      this.nodeGroups.push(new NodeGroup(cData));
    }

    if (data.patterns) for (const cData of data.patterns) {
      this.patterns.push(new Pattern(cData));
    }

    if (data.tracks) for (const cData of data.tracks) {
      this.tracks.push(new Track(cData));
    }
  }
}