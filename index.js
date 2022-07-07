const path = require(`path`);
const { app, BrowserWindow, nativeImage } = require(`electron`);

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
    },
    icon: nativeImage.createFromPath(path.join(__dirname, `./assets/images/node1.png`))
  });

  window.loadFile(`assets/editor.html`);

  window.once(`ready-to-show`, () => {
    window.show();
  });
});

app.on(`window-all-closed`, () => {
  // end program when all windows are closed
  // except macOS because its ✨ not like other girls ✨ or something
  if (process.platform !== `darwin`) {
    app.quit();
  }
});