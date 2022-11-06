import { getName, getVersion } from "@tauri-apps/api/app";

export default function setProjectTitle(text: string) {
  document.title = `${text} | ${getName()} ${getVersion()}`;
  // todo: reimplement discord rpc
  //drpc.setDetails(text);
}