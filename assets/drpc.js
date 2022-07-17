const DiscordRPC = require(`discord-rpc`);

const clientId = `997378700611952660`;
const rpc = new DiscordRPC.Client({ transport: `ipc` });
const startTimestamp = new Date();

let projectVersion = ``;

module.exports.setDetails = details => {
  setActivity(projectVersion, details);
};

module.exports.setup = (version, details) => {
  projectVersion = version;

  rpc.on(`ready`, () => {
    setActivity(version, details);
  });

  rpc.login({ clientId }).catch(console.error);
};

function setActivity(version, details) {
  rpc.setActivity({
    details: details,
    startTimestamp,
    largeImageKey: `logo`,
    largeImageText: `v${version}`,
    instance: false
  });
}
