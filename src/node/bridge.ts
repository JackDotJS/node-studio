import { contextBridge, ipcRenderer } from 'electron';
import pkg from '../../package.json';
import * as drpc from './util/drpc.js';
import isInterface from './util/isInterface.js';

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

// This is a common function between Node and Web. Unfortunately, TS cannot
// compile it to *both* commonjs and esmodules simultaneously without
// duplicating the code.
// The best shot we have at making isInterface available to Web is to pass it
// through and update the global typings.
contextBridge.exposeInMainWorld(`isInterface`, isInterface)