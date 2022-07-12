const { contextBridge, ipcRenderer } = require(`electron`);
const pkg = require(`../package.json`);

const appVersion = `Node Studio ${pkg.version}`;

function setWinTitle(text) {
  document.title = `${text} | ${appVersion}`;
}

window.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector(`#version`).innerHTML = appVersion;
});

contextBridge.exposeInMainWorld(`memUsage`, process.memoryUsage);
contextBridge.exposeInMainWorld(`setWinTitle`, setWinTitle);