import { JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import NodeStudioProject from "./classes/project";
// import { MousePosition, useMousePosition } from "./util/mousePosition"; // Broken
import { useMousePosition, MousePositionInside } from "@solid-primitives/mouse";

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

type SplitableFunction = () => JSX.Element;

export const MemoryContext = createContext<{
  masterAnalyser: AnalyserNode,
  audioContext: AudioContext,

  readonly panels: (SplitableFunction)[],
  addPanel(NewPanel: SplitableFunction): void, // eslint-disable-line no-unused-vars
  removePanel(OldPanel: SplitableFunction): void, // eslint-disable-line no-unused-vars

  readonly isEditingPanels: boolean,
  toggleEditingPanels(): void,

  mousePosition: MousePositionInside
}>();

export function useMemoryContext() {
  const context = useContext(MemoryContext);
  if (!context) throw new Error(`useMemoryContext: MemoryContext is undefined!`);

  return context;
}

export function MemoryProvider(props: { children: JSX.Element }) {
  const audioContext = new window.AudioContext();
  const masterAnalyser = audioContext.createAnalyser();

  const [memoryStore, setMemoryStore] = createStore({
    panels: [] as SplitableFunction[],
    isEditingPanels: false
  });

  const memory = {
    audioContext,
    masterAnalyser,

    get panels() { return memoryStore.panels; },
    addPanel(NewPanel: SplitableFunction) {
      console.log("Adding a panel...");
      return setMemoryStore("panels", memoryStore.panels.length, () => NewPanel);
    },
    removePanel(OldPanel: SplitableFunction) {
      console.log("Removing a panel...");
      return setMemoryStore("panels", memoryStore.panels.filter((panel) => panel !== OldPanel));
    },
    get isEditingPanels() { return memoryStore.isEditingPanels; },
    toggleEditingPanels() {
      setMemoryStore("isEditingPanels", (e) => !e);
    },

    mousePosition: useMousePosition()
  };

  return (
    <MemoryContext.Provider value={memory}>
      {props.children}
    </MemoryContext.Provider>
  );
}