import { onMount } from "solid-js";
import { useMemoryContext } from "../MemoryContext";
import styles from "../css/Graphs.module.css";

export default function SpectrumGraph() {
  let spectrumRef!: HTMLCanvasElement;

  const ctx = useMemoryContext();
  if (!ctx?.masterAnalyser) throw new Error("Missing context master analyser");

  const size = ctx.masterAnalyser.fftSize;

  function drawSpectrumGraph() {
    if (!ctx?.masterAnalyser) throw new Error("drawSpectrumGraph: Missing context master analyser");

    const spectrumCTX = spectrumRef.getContext("2d");
    if (!spectrumCTX) throw new Error("Spectrum canvas does not have a 2d context");

    // fix stupid canvas size bullshittery
    spectrumCTX.canvas.width = spectrumRef.offsetWidth;
    spectrumCTX.canvas.height = spectrumRef.offsetHeight;

    spectrumCTX.clearRect(0, 0, spectrumRef.width, spectrumRef.height);

    const data = new Float32Array(size);
    // const data = new Uint8Array(size);
    ctx?.masterAnalyser?.getFloatFrequencyData(data);
    //memory.masterAnalyser.getByteFrequencyData(data);

    const width = spectrumRef.width / data.length;

    let x = 0;

    for (let i = 0; i < (spectrumRef.width / width); i++) {
      // values for float data (i want to cry)
      const dbValue = data[Math.round(i * data.length / (spectrumRef.offsetWidth / width))];
      const mappedDb = (dbValue - (ctx.masterAnalyser.minDecibels)) * (spectrumRef.offsetHeight / 2) / (ctx.masterAnalyser.maxDecibels - ctx.masterAnalyser.minDecibels) + (spectrumRef.height / 2);

      // values for byte data
      // const dbValue = data[Math.round(i * data.length / (spectrumRef.offsetWidth / width))];
      // const mappedDb = dbValue * (spectrumRef.offsetHeight / 2) / 255;

      const height = Math.max(1, mappedDb);

      spectrumCTX.fillStyle = getComputedStyle(spectrumRef).getPropertyValue(`color`);

      spectrumCTX.fillRect(
        x,
        (spectrumRef.height / 2) - Math.max(1, height / 2),
        width,
        height,
      );

      x += width;
    }

    requestAnimationFrame(drawSpectrumGraph);
  }

  onMount(() => drawSpectrumGraph());

  return (
    <canvas
      ref={spectrumRef}
      class={styles.waveform}
    />
  )
}