import { JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import NodeStudioProject from "./classes/project";
import Panel from "./components/Panel";

export interface IInstrument {
  name: string,
  type: `sine` | `square` | `sawtooth` | `triangle` | `custom`,
  node: Node | OscillatorNode | null, // TODO: can we reduce OscillatorNode to Node?
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

const MemoryContext = createContext<{
  masterAnalyser: AnalyserNode,
  audioContext: AudioContext,

  panels: JSX.Element[],
  addPanel(NewPanel: JSX.Element): void,
  removePanel(OldPanel: JSX.Element): void,
}>();

export function useMemoryContext() {
  const context = useContext(MemoryContext);
  if (!context) throw new Error(`useMemoryContext: MemoryContext is undefined!`);
  
  return context;
}

export function MemoryProvider(props: { children: JSX.Element }) {
  const audioContext = new window.AudioContext();
  const masterAnalyser = audioContext.createAnalyser();

  const [panelsStore, setPanelsStore] = createStore(
    [<Panel />] as JSX.Element[]
  );

  const memory = {
    audioContext,
    masterAnalyser,

    panels: panelsStore,
    addPanel(NewPanel: JSX.Element) {
      console.log("Adding a panel...");
      return setPanelsStore([...panelsStore, NewPanel]);
    },
    removePanel(OldPanel: JSX.Element) {
      console.log("Removing a panel...");
      return setPanelsStore(panelsStore.filter((panel) => panel !== OldPanel));
    }
  }

  return (
    <MemoryContext.Provider value={memory}>
      {props.children}
    </MemoryContext.Provider>
  )
}