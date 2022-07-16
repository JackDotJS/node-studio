import { NSDataType, NSDataCollection } from "./baseClass.mjs";
import { NodeGroup } from "./nodes.mjs";
import { Track } from "./tracks.mjs";
import { Pattern } from "./patterns.mjs";

export class NodeStudioProject extends NSDataType {
  constructor(data = {}) {
    super(false);

    this.format = data.format || 1;
    this.title = data.title || `Untitled Project`;
    this.author = data.author || `Unknown`;
    this.description = data.description || `No description.`;
    this.tempo = data.tempo || 120;
    this.nodeGroups = new NSDataCollection(NodeGroup);
    this.tracks = new NSDataCollection(Track);
    this.patterns = new NSDataCollection(Pattern);
    
    if (data.nodeGroups) for (const cData of data.nodeGroups) {
      this.nodeGroups.add(cData);
    }

    if (data.patterns) for (const cData of data.patterns) {
      this.patterns.add(cData);
    }

    if (data.tracks) for (const cData of data.tracks) {
      this.tracks.add(cData);
    }
  }
}