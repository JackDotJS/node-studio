import { getName, getVersion } from "@tauri-apps/api/app";
import { appWindow } from "@tauri-apps/api/window";

export default async function setProjectTitle(text: string) {
  const appName = await getName();
  const appVersion = await getVersion();
  
  document.title = `${text} | ${appName} ${appVersion}`;
  appWindow.setTitle(`${text} | ${appName} ${appVersion}`);

  // todo: reimplement discord rpc
  //drpc.setDetails(text);
}