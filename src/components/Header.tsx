import styles from "../css/Header.module.css";
import WaveformGraph from "./WaveformGraph";

export default function Header() {
  return (
    <div class={styles.bar}>
      <input type="button" value="File" />
      <input type="button" value="Edit" />
      <input type="button" value="View" />
      <input type="button" value="Nodes" />
      <input type="button" value="Track" />
      <input type="button" value="Help" />

      <input type="text" placeholder="Untitled Project" />

      <WaveformGraph />
      
    </div>
  )
}