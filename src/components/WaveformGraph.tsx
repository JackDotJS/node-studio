import { onMount } from "solid-js";
import { useMemoryContext } from "../MemoryContext";
import styles from "../css/Graphs.module.css";

export default function WaveformGraph() {
  let waveformRef!: HTMLCanvasElement;

  const ctx = useMemoryContext();
  console.log(ctx);
  if (!ctx?.masterAnalyser) throw new Error(">> Memory master analyser is undefined")

  const size = ctx.masterAnalyser.frequencyBinCount;

  function drawWaveformGraph() {
    const waveformCTX = waveformRef.getContext("2d");
    if (!waveformCTX) throw new Error("Waveform has no context! Wtf!");

    waveformCTX.canvas.width = waveformRef.offsetWidth;
    waveformCTX.canvas.height = waveformRef.offsetHeight;

    waveformCTX.clearRect(0, 0, waveformRef.width, waveformRef.height);

    const data = new Float32Array(size);
    ctx?.masterAnalyser?.getFloatTimeDomainData(data);

    const width = waveformRef.width / data.length;

    let x = 0;

    waveformCTX.beginPath();
    waveformCTX.lineWidth = 1;
    waveformCTX.strokeStyle = getComputedStyle(waveformRef).getPropertyValue(`color`);

    for (let i = 0; i < (waveformRef.width / width); i++) {

      waveformCTX.lineTo(x, (waveformRef.offsetHeight / 2) + data[Math.round(i * data.length / (waveformRef.offsetWidth / width))] * waveformRef.offsetHeight);
      x += width;
    }

    waveformCTX.stroke();
    requestAnimationFrame(drawWaveformGraph);
  }

  onMount(() => drawWaveformGraph());

  return (
    <canvas
      ref={waveformRef}
      class={styles.waveform}
    />
  )
}