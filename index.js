const path = require(`path`);
const { app, BrowserWindow, nativeImage, shell } = require(`electron`);

// fix color reproduction
app.commandLine.appendSwitch(`force-color-profile`, `srgb`);

app.on(`ready`, () => {
  // create splash screen
  // may be used later if initial loading times get long
  // but for now, the editor loads almost instantly
  // so this is unnecessary atm

  // const splash = new BrowserWindow({
  //   width: 600,
  //   minWidth: 600,
  //   maxWidth: 600,
  //   height: 300,
  //   minHeight: 300,
  //   maxHeight: 300,
  //   resizable: false,
  //   frame: false
  // });

  // splash.loadFile(`assets/splash.html`);
  // splash.center();

  const window = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 950,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, `assets/preload.js`),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false // this should be false by default, but better safe than sorry
    },
    icon: nativeImage.createFromPath(path.join(__dirname, `./assets/images/node-studio.ico`))
  });
  
  window.loadFile(`assets/editor.html`);

  window.once(`ready-to-show`, () => {
    window.show();
    // splash.destroy();

    // makes web URLs open in the user's actual browser
    window.webContents.on(`will-navigate`, (e, url) => {
      e.preventDefault();
      // rly basic, quick check to ensure we have no weird URLs
      if (!(/^https?:/i).test(url)) return;
      shell.openExternal(url);
    });
  });
});

app.on(`window-all-closed`, () => {
  // end program when all windows are closed
  // except macOS because its ✨ not like other girls ✨ or something
  if (process.platform !== `darwin`) app.quit();
});