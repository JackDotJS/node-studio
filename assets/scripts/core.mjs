import { memory } from "./memory.mjs";

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

const pTitle = document.querySelector(`#projectTitle`);

window.setWinTitle(pTitle.value || pTitle.placeholder);

import(`./graphs.mjs`);
import(`./piano.mjs`);
import(`./mem_usage.mjs`);
import(`./slider.mjs`);
import(`./context.mjs`);
import(`./classes/project.mjs`);
import(`./node_editor.mjs`);

document.addEventListener(`change`, (e) => {
  // just to be sure
  if (e.target.type !== `text` && e.target.type !== `number`) return;

  if (e.target.id === `projectTitle`) window.setWinTitle(e.target.value || e.target.placeholder);

  e.target.blur();
}, true);