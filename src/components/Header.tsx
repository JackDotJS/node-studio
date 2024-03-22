import styles from "../css/Header.module.css";
// import SpectrumGraph from "./SpectrumGraph";
import WaveformGraph from "./WaveformGraph";

export default function Header() {
  return (
    <div class={styles.header}>
      <input type="button" value="File" />
      <input type="button" value="Edit" />
      <input type="button" value="View" />
      <input type="button" value="Nodes" />
      <input type="button" value="Track" />
      <input type="button" value="Help" />

      <input
        style={{ flex: 1 }}
        type="text"
        placeholder="Untitled Project"
      />

      <WaveformGraph />
      {/* <SpectrumGraph /> 
      // FIXME: large box appearing in place of spectrum graph */}

    </div>
  )
}