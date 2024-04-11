import { useMemoryContext } from "../MemoryContext";
import styles from "../css/Header.module.css";
import Panel from "./Panel";
import SpectrumGraph from "./SpectrumGraph";
import WaveformGraph from "./WaveformGraph";

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
        // FIXME: not currently adding panels.
        memoryContext.addPanel(Panel);
        console.log("Adding a panel!");
      }}>+ Panel</button>

      <input
        style={{ flex: 1 }}
        type="text"
        placeholder="Untitled Project"
      />

      <WaveformGraph />
      <SpectrumGraph />

    </div>
  )
}