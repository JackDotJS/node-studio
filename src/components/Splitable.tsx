import { JSX, Match, Switch } from "solid-js";
import SplitLine from "./SplitLine";

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
  return (
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