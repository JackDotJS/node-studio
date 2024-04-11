import { JSX, createContext, useContext } from "solid-js";
import NodeStudioProject from "./classes/project";
import Panel from "./components/Panel";

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

type PanelType = typeof Panel; // FIXME:

const MemoryContext = createContext<{
  masterAnalyser: AnalyserNode,
  audioContext: AudioContext,

  panels: ReturnType<typeof Panel>[],
  addPanel(NewPanel: PanelType): void,
  removePanel(P: PanelType): void,
}>();

export function useMemoryContext() {
  const context = useContext(MemoryContext);
  if (!context) throw new Error(`useMemoryContext: MemoryContext is undefined!`);
  
  return context;
}

export function MemoryProvider(props: { children: JSX.Element }) {
  const audioContext = new window.AudioContext();
  const masterAnalyser = audioContext.createAnalyser();

  const memory = {
    audioContext,
    masterAnalyser,

    panels: [<Panel />, <Panel />], // One panel by default
    addPanel(NewPanel: PanelType) {
      memory.panels.push(<NewPanel />);
    },
    removePanel(P: PanelType) {
      memory.panels = memory.panels.filter((p) => p !== <P />);
    }
  }

  return (
    <MemoryContext.Provider value={memory}>
      {props.children}
    </MemoryContext.Provider>
  )
}