import { memory } from "./memory.mjs";

console.warn(`reminder: cursor changes dont work with the webdev console open!!!`);

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

window.setProjectTitle(pTitle.value || pTitle.placeholder);

import(`./ui/graphs.mjs`);
import(`./ui/piano.mjs`);
import(`./ui/mem_usage.mjs`);
import(`./ui/slider.mjs`);
import(`./ui/context.mjs`);
import(`./classes/project.mjs`);
import(`./ui/node_editor.mjs`);

window.addEventListener(`keydown`, (e) => {
  if (e.key != `Enter` && e.key != `Escape`) return;
  if (e.target.type !== `text` && e.target.type !== `number`) return;

  if (e.target.id === `projectTitle`) {
    const newVal = e.target.value || e.target.placeholder;
    window.setProjectTitle(newVal);
    memory.project.title = newVal;
    console.log(JSON.stringify(memory.project, null, 2));
  }

  e.target.blur();
}, true);

console.log(memory.project);
console.log(JSON.stringify(memory.project, null, 2));