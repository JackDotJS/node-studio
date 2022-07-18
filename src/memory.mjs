import { NodeStudioProject } from "./classes/project.mjs";

export const memory = {
  audioCTX: new window.AudioContext(),
  currentInstrument: 0,
  instruments: [
    {
      name: `Triangle`,
      type: `triangle`,
      node: null,
      attack: 100,
      decay: 0,
      sustain: 1,
      release: 100
    }
  ],
  masterVolume: null,
  masterAnalyser: null,
  project: new NodeStudioProject()
};