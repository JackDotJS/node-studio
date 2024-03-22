import { JSX, createContext } from "solid-js";
import NodeStudioProject from "./classes/project";

export interface IInstrument {
  name: string,
  type: `sine` | `square` | `sawtooth` | `triangle` | `custom`,
  node: Node | OscillatorNode | null, // FIXME: can we reduce OscillatorNode to Node?
  attack: number,
  decay: number,
  sustain: number,
  release: number,
}

export interface IMemory {
  audioCTX: AudioContext,
  currentInstrument: number,
  instruments: IInstrument[],
  masterVolume: GainNode | null,
  masterAnalyser: AnalyserNode | null,
  project: NodeStudioProject,

  [x: string]: any // TODO: **REMOVE THIS LINE WHEN PROJECT IS DONE!**
}

export const MemoryContext = createContext<{
  masterAnalyser: AnalyserNode,
  audioContext: AudioContext
}>();

export function MemoryProvider(props: { children: JSX.Element }) {
  const audioContext = new window.AudioContext();
  const masterAnalyser = audioContext.createAnalyser();

  const memory = {
    audioContext,
    masterAnalyser
  }

  return (
    <MemoryContext.Provider value={memory}>
      {props.children}
    </MemoryContext.Provider>
  )
}