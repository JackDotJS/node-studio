import { loadGraph } from "./graphs.mjs";
import { loadPiano } from "./piano.mjs";
import { loadMemoryMonitor } from "./memory_monitor.mjs";
import { NodeStudioProject } from "./classes/project.mjs";

const memory = {
  audioCTX: new window.AudioContext(),
  currentInstrument: 0,
  instruments: [
    {
      name: `Triangle`,
      type: `triangle`,
      node: null,
      attack: 100,
      decay: 0,
      sustain: 1,
      release: 100
    }
  ],
  masterVolume: null,
  masterAnalyser: null
};

document.addEventListener(`DOMContentLoaded`, () => {
  memory.masterVolume = memory.audioCTX.createGain();
  memory.masterAnalyser = memory.audioCTX.createAnalyser();

  memory.masterVolume.connect(memory.masterAnalyser);
  memory.masterAnalyser.connect(memory.audioCTX.destination);

  memory.masterVolume.gain.value = 0.00;

  memory.masterAnalyser.fftSize = 256; // WARN: frequencyBinCount will always be half of this value!!!
  memory.masterAnalyser.smoothingTimeConstant = 0.0;

  // const debugOutput = document.getElementById(`contextData`);

  setInterval(() => {
    document.querySelector(`#latency`).innerHTML = `LAT: ${memory.audioCTX.baseLatency}s`;
  }, 2500);

  loadGraph(memory);
  loadPiano(memory);
  loadMemoryMonitor();

  // show/hide context menu
  document.addEventListener(`contextmenu`, e => {
    e.preventDefault();
    const pointerX = e.clientX;
    const pointerY = e.clientY;
    const cm = document.querySelector(`#context`);

    const posX = (pointerX + cm.offsetWidth > window.innerWidth) ? window.innerWidth - cm.offsetWidth : pointerX;
    const posY = (pointerY + cm.offsetHeight > window.innerHeight) ? window.innerHeight - cm.offsetHeight : pointerY;

    cm.style.left = `${posX}px`;
    cm.style.top = `${posY}px`;

    cm.className = ``;
  });

  document.addEventListener(`click`, e => {
    const cm = document.querySelector(`#context`);

    cm.className = `cmhide`;
  });
});