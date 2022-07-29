import { contextBridge, ipcRenderer } from 'electron';
import pkg from '../package.json';
import * as drpc from './util/drpc.js';

const appVersion = `Node Studio ${pkg.version}`;

function setProjectTitle(text: string) {
  document.title = `${text} | ${appVersion}`;
  drpc.setDetails(text);
}

window.addEventListener(`DOMContentLoaded`, () => {
  const version = document.querySelector(`#version`);
  if (!version) {
    throw new Error('#version element not found');
  }
  
  version.innerHTML = appVersion;
});

contextBridge.exposeInMainWorld(`memUsage`, process.memoryUsage);
contextBridge.exposeInMainWorld(`setProjectTitle`, setProjectTitle);
contextBridge.exposeInMainWorld(`DRPCResetTime`, drpc.resetTime);