import { For, JSX, createContext, onMount, useContext } from "solid-js";
import { rem } from '../util/sizing';

import styles from "../css/Splitable.module.css";

export const SplitableContext = createContext<{
  panelRefs: HTMLDivElement[]
}>();

export function useSplitableContext() {
  const context = useContext(SplitableContext);
  if (!context) throw new Error(`useSplitableContext: SplitableContext is undefined!`);

  return context;
}

type SplitableProps = {
  type: "horizontal" | "vertical",
  children: JSX.Element[]
}

/**
 * Render two elements that can be split horizontally or vertically.
 * @param props If the type is "horizontal", the children will be rendered side by side. If the type is "vertical", the children will be rendered one on top of the other.
 * @returns {JSX.Element}
 */
export default function Splitable(props: SplitableProps) {

  let container!: HTMLDivElement;
  const panelRefs: HTMLDivElement[] = [];
  const splitlines: HTMLDivElement[] = [];
  const splitlineWidth: number = rem(1); // TODO: would be better to get the actual css value somehow
  
  let dragIndex = 0;
  let isDragging = false;
  let oldEl2EndPos = 0;

  const startDrag = (index: number) => {
    console.debug(`start drag`);
    dragIndex = index;
    isDragging = true;

    const el2 = panelRefs[dragIndex];
    if (props.type === `horizontal`) {
      oldEl2EndPos = el2.getBoundingClientRect().right;
    } else {
      oldEl2EndPos = el2.getBoundingClientRect().bottom;
    }

    console.debug(splitlines, panelRefs, dragIndex);
  };

  // TODO: needs limits!!!
  // TODO: use percentage of container so resizing app window doesnt fuck everything up
  const drag = (e: PointerEvent) => {
    const el1 = panelRefs[dragIndex-1];
    const el2 = panelRefs[dragIndex];

    if (props.type === `horizontal`) {
      const el1Width = Math.max(0, Math.abs(e.clientX - el1.getBoundingClientRect().left) - (splitlineWidth / 2));
      el1.style.width = `${el1Width}px`;
      el1.style.flex = `unset`;

      const el2Width = Math.max(0, Math.abs(e.clientX - oldEl2EndPos) - (splitlineWidth / 2));
      el2.style.width = `${el2Width}px`;
      el2.style.flex = `unset`;
    } else {
      const el1Height = Math.max(0, Math.abs(e.clientY - el1.getBoundingClientRect().top) - (splitlineWidth / 2));
      el1.style.height = `${el1Height}px`;
      el1.style.flex = `unset`;

      const el2Height = Math.max(0, Math.abs(e.clientY - oldEl2EndPos) - (splitlineWidth / 2));
      el2.style.height = `${el2Height}px`;
      el2.style.flex = `unset`;
    }
  };

  const stopDrag = () => {
    isDragging = false;
  };

  onMount(() => {
    try {
      //
      const ctx = useSplitableContext();
      ctx.panelRefs.push(container);
    }
    catch(err) {
      // TODO: probably need a better handler for this
      // this try...catch just stops top-level splitables from breaking
    }

    window.addEventListener(`pointermove`, (e) => {
      if (isDragging) {
        drag(e);
      }
    });

    window.addEventListener(`pointerup`, stopDrag);
    window.addEventListener(`pointercancel`, stopDrag);
  });

  return (
    <SplitableContext.Provider value={{ panelRefs }}>
      <div ref={container} style={{
        display: "flex",
        "flex-direction": props.type === `horizontal` ? "row" : "column",
        "flex": "1",
        "height": "100%"
      }}>
        <For each={props.children}>
          {(item, index) => {
            // eslint-disable-next-line solid/reactivity
            if (index() === 0) {
              return item;
            } else {
              return (
                <>
                  <div
                    data-split-line="true"
                    ref={el => splitlines.push(el)}
                    onPointerDown={() => startDrag(index())}
                    class={`${props.type === `horizontal` ? styles.horizontal : styles.vertical} ${styles.splitLine}`}
                  />
                  {item}
                </>
              );
            }
          }}
        </For>
      </div>
    </SplitableContext.Provider>
  );
}