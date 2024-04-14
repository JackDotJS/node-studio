import { JSX, createEffect } from "solid-js";
import panelStyles from "../css/Panel.module.css";
import clsx from "clsx";
import { useMousePosition, getPositionToElement } from "@solid-primitives/mouse";

type PanelProps = {
  // height?: number,
  // width?: number,
  children?: JSX.Element,
  headerPosition?: "top" | "bottom" | "left" | "right"
}
export default function Panel(props: PanelProps) {

  // const { mousePosition } = useMemoryContext();

  let ref!: HTMLDivElement;
  const mousePosition = useMousePosition();

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

  if (!props.children) {
    return (
      <div ref={ref} class={clsx(panelStyles.panel, panelStyles.centeredContent)}>
        <h2>Select a panel</h2>
        <button>+ Panel</button>
      </div>
    )
  }

  return (
    <div ref={ref}>
      {props.children}
    </div>
  )
}