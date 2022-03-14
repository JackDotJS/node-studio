const { contextBridge, ipcRenderer } = require(`electron`);
const pkg = require(`../../package.json`);

window.addEventListener(`DOMContentLoaded`, () => {
  document.title = `Node Studio ${pkg.version}`;
});