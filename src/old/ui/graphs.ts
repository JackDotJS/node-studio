import memory from "../memory.js";
import isInterface from "../util/is-interface.js";

const masterAnalyser = memory.masterAnalyser;
if (!masterAnalyser) {
  throw new Error(`masterAnalyser not found`);
}

const size = masterAnalyser.frequencyBinCount;

const spectrum = document.getElementById(`spectrum`);
if (!spectrum || !isInterface<HTMLCanvasElement>(spectrum, 'getContext')) { // getContext is a method that only exists on HTMLCanvasElement
  throw new Error(`element with ID #spectrum does not refer to a canvas element`);
}

const spectrumCTX = spectrum.getContext(`2d`);
if (!spectrumCTX) {
  throw new Error(`spectrum element has no context`);
}
const waveform = document.getElementById(`waveform`);
if (!waveform || !isInterface<HTMLCanvasElement>(waveform, 'getContext')) {
  throw new Error(`element with ID #waveform does not refer to a canvas element`);
}
const waveformCTX = waveform.getContext(`2d`);
if (!waveformCTX) {
  throw new Error(`waveform element has no context`);
}

const drawSpectrumGraph = () => {
  // fix stupid canvas size bullshittery
  spectrumCTX.canvas.width = spectrum.offsetWidth;
  spectrumCTX.canvas.height = spectrum.offsetHeight;

  spectrumCTX.clearRect(0, 0, spectrum.width, spectrum.height);

  const data = new Float32Array(size);
  // const data = new Uint8Array(size);
  masterAnalyser.getFloatFrequencyData(data);
  //memory.masterAnalyser.getByteFrequencyData(data);

  const width = spectrum.width / data.length;

  let x = 0;

  for (let i = 0; i < (spectrum.width / width); i++) {
    // values for float data (i want to cry)
    const dbValue = data[Math.round(i * data.length / (spectrum.offsetWidth / width))];
    const mappedDb = (dbValue - (masterAnalyser.minDecibels)) * (spectrum.offsetHeight / 2) / (masterAnalyser.maxDecibels - masterAnalyser.minDecibels) + (spectrum.height / 2);

    // values for byte data
    // const dbValue = data[Math.round(i * data.length / (spectrum.offsetWidth / width))];
    // const mappedDb = dbValue * (spectrum.offsetHeight / 2) / 255;

    const height = Math.max(1, mappedDb);

    spectrumCTX.fillStyle = getComputedStyle(spectrum).getPropertyValue(`color`);

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
  masterAnalyser.getFloatTimeDomainData(data);

  const width = waveform.width / data.length;

  let x = 0;

  waveformCTX.beginPath();
  waveformCTX.lineWidth = 1;
  waveformCTX.strokeStyle = getComputedStyle(waveform).getPropertyValue(`color`);

  for (let i = 0; i < (waveform.width / width); i++) {

    waveformCTX.lineTo(x, (waveform.offsetHeight / 2) + data[Math.round(i * data.length / (waveform.offsetWidth / width))] * waveform.offsetHeight);
    x += width;
  }

  waveformCTX.stroke();
  requestAnimationFrame(drawWaveformGraph);
};

drawSpectrumGraph();
drawWaveformGraph();