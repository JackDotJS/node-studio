import { For, createEffect } from "solid-js";
import { useMemoryContext } from "../MemoryContext";

export default function PanelHandler() {
  // Destructuring things from context causes reactivity to break.
  // Unfortunately, we'll need to grab the whole context object
  // in order to use only some of its properties / methods.
  const memoryContext = useMemoryContext();

  let ref!: HTMLDivElement;

  createEffect(() => {
    if (memoryContext.isEditingPanels) {
      ref.style.cursor = "copy";
    } else {
      ref.style.cursor = "auto";
    }
  });

  /* https://docs.solidjs.com/concepts/control-flow/list-rendering#index-vs-for */
  return (
    <div
      ref={ref}
      style={{
        "flex": 1,
        "flex-direction": "row",
        "display": "flex"
      }}
    >
      <For each={memoryContext.panels}>
        {(P) => P()}
      </For>
    </div>
  );
}