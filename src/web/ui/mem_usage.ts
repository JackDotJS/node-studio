export default function formatBytes(bytes: number): string {
  if (bytes === 0) return `0 Bytes`;

  const k = 1024;
  const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(2) + ` ` + sizes[i];
}

const readout = document.querySelector(`#memUsage`);

if (!readout) {
  throw new Error(`memUsage element not found`);
}

setInterval(() => {
  const mem = memUsage().rss;

  readout.innerHTML = `MEM: ${formatBytes(mem)}`;
}, 2500);