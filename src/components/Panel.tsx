import { JSX, Show, onMount } from "solid-js";
import panelStyles from "../css/Panel.module.css";
import clsx from "clsx";
import { useSplitableContext } from "./Splitable";

type PanelProps = {
  // height?: number,
  // width?: number,
  children?: JSX.Element,
  headerPosition?: "top" | "bottom" | "left" | "right",
  // panelID: string
}
export default function Panel(props: PanelProps) {

  let panelRef!: HTMLDivElement;

  const ctx = useSplitableContext();

  onMount(() => {
    ctx.panelRefs.push(panelRef);
  });

  return (
    <Show when={props.children} fallback={<FallbackComponent ref={panelRef} />}>
      <div ref={panelRef}>
        {props.children}
      </div>
    </Show>
  );
}

function FallbackComponent(props: { ref: HTMLDivElement }) {
  return <div
    ref={props.ref}
    class={clsx(panelStyles.panel, panelStyles.centeredContent)}
  >
    <h2>Select a panel</h2>
    <button>+ Panel</button>
  </div>;
}