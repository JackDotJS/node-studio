import { memory } from "./memory.mjs";

document.addEventListener(`DOMContentLoaded`, () => {
  memory.masterVolume = memory.audioCTX.createGain();
  memory.masterAnalyser = memory.audioCTX.createAnalyser();

  memory.masterVolume.connect(memory.masterAnalyser);
  memory.masterAnalyser.connect(memory.audioCTX.destination);

  memory.masterVolume.gain.value = 0.00;

  memory.masterAnalyser.fftSize = 256; // WARN: frequencyBinCount will always be half of this value!!!
  memory.masterAnalyser.smoothingTimeConstant = 0.0;

  memory.willChange = 3458937459;

  setInterval(() => {
    document.querySelector(`#latency`).innerHTML = `LAT: ${memory.audioCTX.baseLatency}s`;
  }, 2500);

  // loadGraph(memory);
  // loadPiano(memory);
  // loadSliders();
  // loadMemoryMonitor();
  // loadContextMenuHandler();
  import(`./graphs.mjs`);
  import(`./piano.mjs`);
  import(`./mem_usage.mjs`);
  import(`./slider.mjs`);
  import(`./context.mjs`);
  import(`./classes/project.mjs`);
  import(`./node_editor.mjs`);
});