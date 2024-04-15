export default function SplitLine(props: { type: "horizontal" | "vertical" }) {
  // Thin line between panels, usually used in a Splitable.

  return (
    <div style={{
      "width": props.type === "horizontal" ? "1px" : "100%",
      "height": props.type === "vertical" ? "1px" : "100%",
      "border": "2px solid magenta",
    }} />
  );
}