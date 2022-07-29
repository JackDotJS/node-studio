import memory from "./memory.mjs";

import './ui/graphs.mjs';
import './ui/mem_usage.mjs'
import './ui/slider.mjs';
import './ui/contextMenu.mjs';
import './ui/node_editor.mjs'
import './classes/project.mjs';
import isInterface from "./util/isInterface.js";

console.warn(`reminder: cursor changes don't work with the console open!!!`);

memory.masterVolume = memory.audioCTX.createGain();
memory.masterAnalyser = memory.audioCTX.createAnalyser();

memory.masterVolume.connect(memory.masterAnalyser);
memory.masterAnalyser.connect(memory.audioCTX.destination);

memory.masterVolume.gain.value = 0.00;

memory.masterAnalyser.fftSize = 256; // WARN: frequencyBinCount will always be half of this value!!!
memory.masterAnalyser.smoothingTimeConstant = 0.0;

memory.willChange = 3458937459;

setInterval(() => {
  const latencyElement = document.getElementById(`latency`);

  if (!latencyElement) {
    throw new Error(`latency element not found`);
  }

  latencyElement.innerHTML = `LAT: ${memory.audioCTX.baseLatency}s`;
}, 2500);

const pTitle: HTMLInputElement | null = document.querySelector(`#projectTitle`);

if (!pTitle) {
  throw new Error(`projectTitle element not found`);
}

setProjectTitle(pTitle.value || pTitle.placeholder);

import(`./ui/piano.mjs`);

window.addEventListener(`keydown`, (e: KeyboardEvent) => {
  if (e.key != `Enter` && e.key != `Escape`) return;

  if (isInterface<HTMLInputElement>(e.target, `type`)) {
    if (e.target.type !== `text` && e.target.type !== `number`) return;

    e.target.blur();
  }

  if (isInterface<HTMLTextAreaElement>(e.target, `id`)) {
    if (e.target.id === `projectTitle`) {
      const newVal = e.target.value || e.target.placeholder;
      setProjectTitle(newVal);
      memory.project.title = newVal;
      console.log(JSON.stringify(memory.project, null, 2));
    }
  }
}, true);

console.log(memory.project);
console.log(JSON.stringify(memory.project, null, 2));