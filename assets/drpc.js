const DiscordRPC = require(`discord-rpc`);

const clientId = `997378700611952660`;
const rpc = new DiscordRPC.Client({ transport: `ipc` });
const startTimestamp = new Date();

let projectVersion = ``;
let ready = false;

module.exports.setDetails = details => {
  // wait until ready is true before setting the details
  if (!ready) {
    return this.setDetails(details);
  }

  setActivity(projectVersion, details);
};

module.exports.setup = (version, details) => {
  projectVersion = version;

  rpc.on(`ready`, () => {
    setActivity(version, details);
    ready = true;
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
