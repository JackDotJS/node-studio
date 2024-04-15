import { JSX, Match, Switch } from "solid-js";

type SplitableProps = {
  topElement?: JSX.Element,
  bottomElement?: JSX.Element,
  leftElement?: JSX.Element,
  rightElement?: JSX.Element,
}

export default function Splitable(props: SplitableProps) {
  return (
    <Switch fallback={<FallbackComponent />}>
      <Match when={props.topElement && props.bottomElement}>
        <div style={{ display: "flex", "flex-direction": "column" }}>
          {props.topElement}
          {props.bottomElement}
        </div>
      </Match>
      <Match when={props.leftElement && props.rightElement}>
        <div style={{ display: "flex", "flex-direction": "row" }}>
          {props.leftElement}
          {props.rightElement}
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