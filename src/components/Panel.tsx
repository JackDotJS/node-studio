import { JSX, Show, createEffect } from "solid-js";
import panelStyles from "../css/Panel.module.css";
import clsx from "clsx";
import { getPositionToElement } from "@solid-primitives/mouse";
import { useMemoryContext } from "../MemoryContext";

type PanelProps = {
  // height?: number,
  // width?: number,
  children?: JSX.Element,
  headerPosition?: "top" | "bottom" | "left" | "right"
}
export default function Panel(props: PanelProps) {

  const { mousePosition } = useMemoryContext();

  let ref!: HTMLDivElement;

  createEffect(() => {
    const relative = getPositionToElement(mousePosition.x, mousePosition.y, ref);
    // console.log(relative.x, relative.y);

    // Calculate which cursor to show based on the position of the mouse
    // based on the relative positions
    if (relative.x < 10) {
      ref.style.cursor = "col-resize";
    }
    else if (relative.x > ref.offsetWidth - 10) {
      ref.style.cursor = "col-resize";
    }
    else if (relative.y < 10) {
      ref.style.cursor = "row-resize";
    }
    else if (relative.y > ref.offsetHeight - 10) {
      ref.style.cursor = "row-resize";
    }
    else {
      ref.style.cursor = "default";
    }
  });

  return (
    <Show when={props.children} fallback={<FallbackComponent ref={ref} />}>
      <div ref={ref}>
        {props.children}
      </div>
    </Show>
  );
}

function FallbackComponent(props: { ref: HTMLDivElement }) {
  return <div ref={props.ref} class={clsx(panelStyles.panel, panelStyles.centeredContent)}>
    <h2>Select a panel</h2>
    <button>+ Panel</button>
  </div>;
}