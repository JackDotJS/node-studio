const { contextBridge, ipcRenderer } = require(`electron`);
const pkg = require(`../package.json`);

window.addEventListener(`DOMContentLoaded`, () => {
  const title = `Node Studio ${pkg.version}`
  document.title = `Untitled Project | ${title}`;
  document.querySelector(`#version`).innerHTML = title;
});

contextBridge.exposeInMainWorld(`memUsage`, process.memoryUsage);