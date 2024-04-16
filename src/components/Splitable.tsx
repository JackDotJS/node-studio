import { JSX, Match, Switch, createContext, createSignal, useContext } from "solid-js";
import SplitLine from "./SplitLine";

export const SplitableContext = createContext<{
  elementOne: HTMLDivElement,
  elementTwo: HTMLDivElement,

  setElementOne: (element: HTMLDivElement) => void, // eslint-disable-line no-unused-vars
  setElementTwo: (element: HTMLDivElement) => void, // eslint-disable-line no-unused-vars
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

  return (
    <SplitableContext.Provider value={{
      get elementOne() { return elementOne()!; },
      get elementTwo() { return elementTwo()!; },
      setElementOne,
      setElementTwo
    }}>
      <Switch fallback={<FallbackComponent />}>
        <Match when={props.type === "vertical"}>
          <div style={{ display: "flex", "flex-direction": "column", flex: 1 }}>
            {props.children[0]}
            <SplitLine type="vertical" />
            {props.children[1]}
          </div>
        </Match>
        <Match when={props.type === "horizontal"}>
          <div style={{ display: "flex", "flex-direction": "row", flex: 1 }}>
            {props.children[0]}
            <SplitLine type="horizontal" />
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