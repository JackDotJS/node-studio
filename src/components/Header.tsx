import styles from "../css/Header.module.css";
import SpectrumGraph from "./SpectrumGraph";
import WaveformGraph from "./WaveformGraph";

export default function Header() {
  return (
    <div class={styles.header}>
      <button>File</button>
      <button>Edit</button>
      <button>View</button>
      <button>Nodes</button>
      <button>Track</button>
      <button>Help</button>

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