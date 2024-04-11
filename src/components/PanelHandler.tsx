import { For } from "solid-js";
import { useMemoryContext } from "../MemoryContext";

export default function PanelHandler() {
  const { panels } = useMemoryContext();

  /* https://docs.solidjs.com/concepts/control-flow/list-rendering#index-vs-for */
  return (
    <div style={{
      "flex": 1,
      "flex-direction": "row",
      "display": "flex"
    }}>
      <For each={panels}>
        {(P) => P}
      </For>
    </div>
  )
}