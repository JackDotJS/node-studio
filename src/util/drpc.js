const DiscordRPC = require(`discord-rpc`);
const pkg = require(`../../package.json`);

const clientId = `997378700611952660`;

let client = null;

let projectTimestamp = new Date();
let projectDetails = `Loading...`;

module.exports._test = () => {
  console.log(projectDetails);
};

module.exports.setDetails = text => {
  projectDetails = text;

  if (client == null) setup();
  else setActivity();
};

module.exports.resetTime = () => {
  projectTimestamp = new Date();

  if (client == null) setup();
  else setActivity();
};

module.exports.destroy = () => {
  if (client == null) return;
  client.destroy();
};

function setup() {
  client = new DiscordRPC.Client({ transport: `ipc` });

  client.on(`ready`, () => {
    setActivity();
  });

  client.login({ clientId }).catch(console.error);
}

function setActivity() {
  if (client != null) client.setActivity({
    details: projectDetails,
    startTimestamp: projectTimestamp,
    largeImageKey: `logo`,
    largeImageText: `v${pkg.version}`,
    instance: false
  });
}
