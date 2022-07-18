import { memory } from "../memory.js";

const size = memory.masterAnalyser.frequencyBinCount;

const spectrum = document.getElementById(`spectrum`);
const spectrumCTX = spectrum.getContext(`2d`);
const waveform = document.getElementById(`waveform`);
const waveformCTX = waveform.getContext(`2d`);

const drawSpectrumGraph = () => {
  // fix stupid canvas size bullshittery
  spectrumCTX.canvas.width = spectrum.offsetWidth;
  spectrumCTX.canvas.height = spectrum.offsetHeight;

  spectrumCTX.clearRect(0, 0, spectrum.width, spectrum.height);

  const data = new Float32Array(size);
  // const data = new Uint8Array(size);
  memory.masterAnalyser.getFloatFrequencyData(data);
  //memory.masterAnalyser.getByteFrequencyData(data);

  const width = spectrum.width / data.length;

  let x = 0;

  for (let i = 0; i < (spectrum.width / width); i++) {
    // values for float data (i want to cry)
    const dbValue = data[Math.round(i * data.length / (spectrum.offsetWidth / width))];
    const mappedDb = (dbValue - (memory.masterAnalyser.minDecibels)) * (spectrum.offsetHeight / 2) / (memory.masterAnalyser.maxDecibels - memory.masterAnalyser.minDecibels) + (spectrum.height / 2);

    // values for byte data
    // const dbValue = data[Math.round(i * data.length / (spectrum.offsetWidth / width))];
    // const mappedDb = dbValue * (spectrum.offsetHeight / 2) / 255;

    const height = Math.max(1, mappedDb);

    spectrumCTX.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(`--ma`);

    spectrumCTX.fillRect(
      x,
      (spectrum.height / 2) - Math.max(1, height / 2),
      width,
      height,
    );

    x += width;
  }

  requestAnimationFrame(drawSpectrumGraph);
};

const drawWaveformGraph = () => {
  // fix stupid canvas size bullshittery
  waveformCTX.canvas.width = waveform.offsetWidth;
  waveformCTX.canvas.height = waveform.offsetHeight;

  waveformCTX.clearRect(0, 0, waveform.width, waveform.height);

  const data = new Float32Array(size);
  memory.masterAnalyser.getFloatTimeDomainData(data);

  const width = waveform.width / data.length;

  let x = 0;

  waveformCTX.beginPath();
  waveformCTX.lineWidth = 1;
  waveformCTX.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(`--ma`);

  for (let i = 0; i < (waveform.width / width); i++) {

    waveformCTX.lineTo(x, (waveform.offsetHeight / 2) + data[Math.round(i * data.length / (waveform.offsetWidth / width))] * waveform.offsetHeight);
    x += width;
  }

  waveformCTX.stroke();
  requestAnimationFrame(drawWaveformGraph);
};

drawSpectrumGraph();
drawWaveformGraph();