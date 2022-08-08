import * as fs from 'fs';
import * as path from 'path';
import { app, BrowserWindow, nativeImage, shell } from 'electron';
import * as drpc from './util/drpc';
import isInterface from './util/isInterface';

interface IConfig {
  window?: {
    pos: number[],
    size: number[]
  }
}
let config: IConfig = {};

// fix color reproduction
app.commandLine.appendSwitch(`force-color-profile`, `srgb`);

// create directories that may or may not exist because Git(TM)
const mkdirs = [
  `./.local`,
  `./userdata`,
  `./logs/`,
];

for (const item of mkdirs) {
  if (!fs.existsSync(item)) {
    fs.mkdirSync(item, { recursive: true });
  }
}

interface ErrorWithCode extends Error {
  code?: string;
}
try {
  // try making file if it does not exist
  fs.writeFileSync('./userdata/config.json', JSON.stringify(config), { encoding: `utf8`, flag: `ax` });
} catch (e) {
  if (isInterface<ErrorWithCode>(e, `code`)) {
    if (e.code !== `EEXIST`) throw e;
  }

  config = require(`../../userdata/config.json`);
  console.log(config);
}

app.whenReady().then(() => {
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
    minHeight: 650,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, `../../src/node/bridge.js`),
      contextIsolation: true,
      nodeIntegration: false // this should be false by default, but better safe than sorry
    },
    icon: nativeImage.createFromPath(path.join(__dirname, `../assets/node-studio.ico`))
  });

  if (config.window != null) {
    window.setPosition(config.window.pos[0], config.window.pos[1]);
    window.setSize(config.window.size[0], config.window.size[1]);
  } else {
    config.window = {
      pos: window.getPosition(),
      size: window.getSize()
    }
  }

  window.loadFile(`./src/editor.html`);

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

  window.on(`move`, () => {
    if (!config.window) {
      throw new Error(`You should not have gotten this error.`);
    }

    config.window.pos = window.getPosition();
  });

  window.on(`resize`, () => {
    if (!config.window) {
      throw new Error(`You should not have gotten this error.`);
    }

    config.window.size = window.getSize();
  });
});

app.on(`window-all-closed`, () => {
  fs.writeFileSync(`./userdata/config.json`, JSON.stringify(config), { encoding: `utf8` });

  drpc._test();
  drpc.destroy();

  // end program when all windows are closed
  // except macOS because its ✨ not like other girls ✨ or something
  if (process.platform !== `darwin`) app.quit();
});