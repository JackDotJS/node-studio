const path = require(`path`);
const { app, BrowserWindow } = require(`electron`);

app.on(`ready`, () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    center: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, `assets/scripts/preload.js`),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false // this should be false by default, but better safe than sorry
    }
  });

  window.loadFile(`views/editor.html`);

  window.webContents.on(`did-finish-load`, function() {
    window.show();
  });
});

app.on(`window-all-closed`, () => {
  app.quit();
});