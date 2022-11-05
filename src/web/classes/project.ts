import { NodeGroup } from "./nodes.js";
import Track from "./tracks.js";
import Pattern from "./patterns.js";

interface NodeStudioProjectOptions {
  format?: number,
  title?: string,
  author?: string,
  description?: string,
  bpm?: number,
  nodeGroups?: NodeGroup[],
  tracks?: Track[],
  patterns?: Pattern[]
}

export default class NodeStudioProject {

  public format: number;
  public title: string;
  public author: string;
  public description: string;
  public bpm: number;
  public nodeGroups?: NodeGroup[];
  public tracks?: Track[];
  public patterns?: Pattern[];

  constructor(data: NodeStudioProjectOptions = {}) {
    this.format = data.format ?? 1;
    this.title = data.title ?? `Untitled Project`;
    this.author = data.author ?? `Unknown`;
    this.description = data.description ?? `No description.`;
    this.bpm = data.bpm ?? 120;
    this.nodeGroups = [];
    this.tracks = [];
    this.patterns = [];
    
    if (data.nodeGroups) for (const cData of data.nodeGroups) {
      this.nodeGroups.push(cData);
    }
    
    if (data.tracks) for (const cData of data.tracks) {
      this.tracks.push(cData);
    }

    if (data.patterns) for (const cData of data.patterns) {
      this.patterns.push(cData);
    }

  }
}