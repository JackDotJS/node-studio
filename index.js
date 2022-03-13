const { app, BrowserWindow } = require(`electron`);

const init = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    center: true,
    show: false,
  });

  window.loadFile(`views/startup.html`);

  window.webContents.on(`did-finish-load`, function() {
    window.show();
  });
};

app.on(`ready`, () => {
  init();
});

app.on(`window-all-closed`, () => {
  app.quit();
});