const { contextBridge, ipcRenderer } = require(`electron`);
const pkg = require(`../package.json`);
const { setup: drpcSetup, setDetails: setDrpcDetails } = require(`./drpc.js`);

const appVersion = `Node Studio ${pkg.version}`;

function setWinTitle(text) {
  document.title = `${text} | ${appVersion}`;
  setDrpcDetails(text);
}

window.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector(`#version`).innerHTML = appVersion;
});

contextBridge.exposeInMainWorld(`memUsage`, process.memoryUsage);
contextBridge.exposeInMainWorld(`setWinTitle`, setWinTitle);

drpcSetup(pkg.version, `Loading...`);