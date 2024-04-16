import { JSX, Match, Switch, createContext, createSignal, onMount, useContext } from "solid-js";

import styles from "../css/Splitable.module.css";

export const SplitableContext = createContext<{
  elementOne: HTMLDivElement,
  elementTwo: HTMLDivElement,

  setElementOne: (element: HTMLDivElement) => void, // eslint-disable-line no-unused-vars
  setElementTwo: (element: HTMLDivElement) => void, // eslint-disable-line no-unused-vars

  splitDirection: "horizontal" | "vertical"
}>();

export function useSplitableContext() {
  const context = useContext(SplitableContext);
  if (!context) throw new Error(`useSplitableContext: SplitableContext is undefined!`);

  return context;
}

type SplitableProps = {
  type: "horizontal" | "vertical",
  children: [JSX.Element, JSX.Element]
}

/**
 * Render two elements that can be split horizontally or vertically.
 * @param props If the type is "horizontal", the children will be rendered side by side. If the type is "vertical", the children will be rendered one on top of the other.
 * @returns {JSX.Element}
 */
export default function Splitable(props: SplitableProps) {

  const [elementOne, setElementOne] = createSignal<HTMLDivElement>();
  const [elementTwo, setElementTwo] = createSignal<HTMLDivElement>();

  let splitline!: HTMLDivElement;
  let splitlineWidth: number = 0;
  
  let isDragging = false;

  const startDrag = () => {
    isDragging = true;
  };

  const drag = (e: PointerEvent) => {
    const e1 = elementOne();

    if (e1 == null) return;

    if (props.type === `horizontal`) {
      const relativePosition = (e.clientX - e1.getBoundingClientRect().left) - (splitlineWidth / 2);
      e1.style.width = `${relativePosition}px`;
      e1.style.flex = `unset`;
    } else {
      const relativePosition = (e.clientY - e1.getBoundingClientRect().top) - (splitlineWidth / 2);
      e1.style.height = `${relativePosition}px`;
      e1.style.flex = `unset`;
    }
  };

  const stopDrag = () => {
    isDragging = false;
  };

  onMount(() => {
    if (props.type === `horizontal`) {
      splitlineWidth = splitline.getBoundingClientRect().width;
    } else {
      splitlineWidth = splitline.getBoundingClientRect().height;
    }

    splitline.addEventListener(`pointerdown`, () => {
      console.debug(`start drag`);
      startDrag();
    });

    window.addEventListener(`pointermove`, (e) => {
      if (isDragging) {
        drag(e);
      }
    });

    window.addEventListener(`pointerup`, stopDrag);
    window.addEventListener(`pointercancel`, stopDrag);
  });

  return (
    <SplitableContext.Provider value={{
      get elementOne() { return elementOne()!; },
      get elementTwo() { return elementTwo()!; },
      setElementOne,
      setElementTwo,
      get splitDirection() { return props.type; }
    }}>
      <Switch fallback={<FallbackComponent />}>
        <Match when={props.type === "vertical"}>
          <div style={{
            display: "flex",
            "flex-direction": "column",
            "flex": "1",
            "height": "100%"
          }}>
            {props.children[0]}
            {/* <SplitLine type="vertical" /> */}
            <div
              data-split-line="true"
              ref={splitline}
              class={`${styles.vertical} ${styles.splitLine}`}
            />
            {props.children[1]}
          </div>
        </Match>
        <Match when={props.type === "horizontal"}>
          <div style={{
            display: "flex",
            "flex-direction": "row",
            "flex": "1",
            "height": "100%"
          }}>
            {props.children[0]}
            {/* <SplitLine type="horizontal" /> */}
            <div
              data-split-line="true"
              ref={splitline}
              class={`${styles.horizontal} ${styles.splitLine}`}
            />
            {props.children[1]}
          </div>
        </Match>
      </Switch>
    </SplitableContext.Provider>
  );
}

function FallbackComponent() {
  return (
    <div>
      <h1>Error</h1>
      <p>You should not see this component</p>
    </div>
  );
}