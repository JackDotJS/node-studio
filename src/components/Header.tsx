import { useMemoryContext } from "../MemoryContext";
import styles from "../css/Header.module.css";
import Panel from "./Panel";
import SpectrumGraph from "./SpectrumGraph";
import WaveformGraph from "./WaveformGraph";
import Splitable from "./Splitable";

export default function Header() {

  const memoryContext = useMemoryContext();

  return (
    <div class={styles.header}>
      <button>File</button>
      <button>Edit</button>
      <button>View</button>
      <button>Nodes</button>
      <button>Track</button>
      <button>Help</button>
      <button onClick={() => {
        memoryContext.addPanel(() => (
          <Splitable type="horizontal">
            <Panel />
            <Panel />
          </Splitable>
        ));
        // memoryContext.setPanels([...memoryContext.panels, <Panel />]);
        console.log(memoryContext.panels);
      }}>+ Panel</button>

      <input
        style={{ flex: 1 }}
        type="text"
        placeholder="Untitled Project"
      />

      <WaveformGraph />
      <SpectrumGraph />

    </div>
  );
}