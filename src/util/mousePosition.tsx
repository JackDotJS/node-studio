import { createSignal } from "solid-js";

export type MousePosition = { x: number, y: number };

export function useMousePosition(): MousePosition {

  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  window.addEventListener("mousemove", e => {
    setPosition({ x: e.clientX, y: e.clientY });
    // console.log(position());
  });

  return position();
}

export function getPositionToElement(pageX: number, pageY: number, el: HTMLElement) {
  if (!el) {
    throw new Error("Element is null!");
  }

  const bounds = el.getBoundingClientRect(), top = bounds.top + window.scrollY, left = bounds.left + window.scrollX, x = pageX - left, y = pageY - top, { width, height } = bounds;
  return {
    x,
    y,
    top,
    left,
    width,
    height,
    isInside: x >= 0 && y >= 0 && x <= width && y <= height
  };
};