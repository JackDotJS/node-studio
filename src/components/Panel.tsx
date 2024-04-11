import { JSX } from "solid-js";
// import { createStore } from "solid-js/store";
import panelStyles from "../css/Panel.module.css";

import clsx from "clsx";

type PanelProps = {
  // height?: number,
  // width?: number,
  children?: JSX.Element,
  headerPosition?: "top" | "bottom" | "left" | "right"
}
export default function Panel(props: PanelProps) {
  // const [state, setState] = createStore({
  //   headerPosition: props.headerPosition ?? "top"
  // });

  if (!props.children) {
    return (
      <div class={clsx(panelStyles.panel, panelStyles.centeredContent)}>
        <h2>Select a panel</h2>
        <button>+ Panel</button>
      </div>
    )
  }

  return (
    <div>
      {props.children}
    </div>
  )
}