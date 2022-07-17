const { contextBridge, ipcRenderer } = require(`electron`);
const pkg = require(`../package.json`);
const drpc = require(`./drpc.js`);

const appVersion = `Node Studio ${pkg.version}`;

function setProjectTitle(text) {
  document.title = `${text} | ${appVersion}`;
  drpc.setDetails(text);
}

window.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector(`#version`).innerHTML = appVersion;
});

contextBridge.exposeInMainWorld(`memUsage`, process.memoryUsage);
contextBridge.exposeInMainWorld(`setProjectTitle`, setProjectTitle);
contextBridge.exposeInMainWorld(`DRPCResetTime`, drpc.resetTime);