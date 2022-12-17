import memory from "./memory";
import setProjectTitle from './util/set-project-title';
import isInterface from './util/is-interface';

import { invoke } from "@tauri-apps/api";
import { getVersion } from "@tauri-apps/api/app";

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

setProjectTitle("APP TITLE TESTING");

invoke("enable_drpc", { nsVersion: await getVersion(), projectName: "TEST PROJECT NAME" });

import('./ui/panel-manager.js');
import('./ui/slider');
import('./ui/context-menu');
import('./ui/node-editor');
import('./ui/piano.js');
import('./ui/graphs.js');
import('./ui/memory-usage.js');
import('./classes/project.js');

window.addEventListener(`keydown`, (e: KeyboardEvent) => {
  if (e.key != `Enter` && e.key != `Escape`) return;

  if (isInterface<HTMLInputElement>(e.target, `type`)) {
    if (e.target.type !== `text` && e.target.type !== `number`) return;

    e.target.blur(); // blur unfocuses the element
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