const DiscordRPC = require(`discord-rpc`);
const pkg = require(`../../package.json`);

// https://discord.com/developers
const clientId = `998040133829922817`;

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
    details: `Working on "${projectDetails}"`,
    startTimestamp: projectTimestamp,
    largeImageKey: `nodestudio`,
    largeImageText: `V${pkg.version}`,
    instance: false
  });
}
