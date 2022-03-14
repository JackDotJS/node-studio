const path = require(`path`);
const { app, BrowserWindow } = require(`electron`);

// should fix color reproduction
app.commandLine.appendSwitch(`force-color-profile`, `srgb`);

app.on(`ready`, () => {
  const window = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 950,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
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