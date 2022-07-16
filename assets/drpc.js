const DiscordRPC = require(`discord-rpc`);

const clientId = `997378700611952660`;
const rpc = new DiscordRPC.Client({ transport: `ipc` });
const startTimestamp = new Date();

function setActivity() {
  rpc.setActivity({
    details: `[Project name here]`,
    startTimestamp,
    largeImageKey: `logo`,
    largeImageText: `v[version-num-here]`,
    instance: false
  });
}

rpc.on(`ready`, () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => { setActivity(); }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
