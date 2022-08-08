import { Client } from 'discord-rpc';
import pkg from '../../../package.json';

// https://discord.com/developers
const clientId = `998040133829922817`;

let client: Client | null = null;

let projectTimestamp = new Date();
let projectDetails = `Loading...`;

export function _test () {
  console.log(projectDetails);
};

export function setDetails(text: string) {
  projectDetails = text;

  if (client == null) setup();
  else setActivity();
};

export function resetTime() {
  projectTimestamp = new Date();

  if (client == null) setup();
  else setActivity();
};

export function destroy() {
  if (client == null) return;
  client.destroy();
};

function setup() {
  client = new Client({ transport: `ipc` });

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
