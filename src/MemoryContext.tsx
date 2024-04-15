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

type PanelFunction = () => JSX.Element;

export const MemoryContext = createContext<{
  masterAnalyser: AnalyserNode,
  audioContext: AudioContext,

  readonly panels: (PanelFunction)[],
  addPanel(NewPanel: PanelFunction): void, // eslint-disable-line no-unused-vars
  removePanel(OldPanel: PanelFunction): void, // eslint-disable-line no-unused-vars

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

  const [panelsStore, setPanelsStore] = createStore({
    panels: [] as PanelFunction[],
    isEditingPanels: false
  });

  const memory = {
    audioContext,
    masterAnalyser,

    get panels() { return panelsStore.panels; },
    addPanel(NewPanel: PanelFunction) {
      console.log("Adding a panel...");
      return setPanelsStore("panels", panelsStore.panels.length, () => NewPanel);
    },
    removePanel(OldPanel: PanelFunction) {
      console.log("Removing a panel...");
      return setPanelsStore("panels", panelsStore.panels.filter((panel) => panel !== OldPanel));
    },
    get isEditingPanels() { return panelsStore.isEditingPanels; },
    toggleEditingPanels() {
      setPanelsStore("isEditingPanels", (e) => !e);
    },

    mousePosition: useMousePosition()
  };

  return (
    <MemoryContext.Provider value={memory}>
      {props.children}
    </MemoryContext.Provider>
  );
}