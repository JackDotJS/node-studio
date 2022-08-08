const editor = document.querySelector(`#nodeEditor`);
if (!editor) {
  throw new Error(`Node editor not found`);
}

const wrapper: HTMLElement | null = editor.querySelector(`#ndGridWrapper`);
if (!wrapper) {
  throw new Error(`Node editor wrapper not found`);
}

const grid: HTMLElement | null = editor.querySelector(`#ndGrid`);
if (!grid) {
  throw new Error(`Node editor grid not found`);
}

const connections = [
  {
    node0: {
      id: `node001`,
      plug: 1
    },
    node1: {
      id: `node002`,
      plug: 0
    }
  }
];

interface IActive { // TODO: this may need to be renamed
  node: HTMLElement,
  offsetX: number,
  offsetY: number,
}
let active: IActive | null = null;
let edgeScroll: (() => void) | null = null; // FIXME: what the heck is this
let mx = 0;
let my = 0;

interface IGridMove { // TODO: this may need to be renamed
  oldLeft: number,
  oldTop: number,
  oldX: number,
  oldY: number
}
let gridMove: IGridMove | null = null;

// center grid on startup
wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) / 2;

grid.addEventListener(`mousedown`, (e) => {
  if (!isInterface<MouseEvent>(e, `clientX`)) {
    throw new Error(`You should not be seeing this error. For some reason, \`mousedown\` is not a MouseEvent.`);
  }
  e.preventDefault();

  mx = e.clientX;
  my = e.clientY;

  if (e.button === 1) handleMiddle();
  if (e.button === 0) handleMouseL();
});

window.addEventListener(`mousemove`, (e) => {
  mx = e.clientX;
  my = e.clientY;

  /*
   * for some fucking reason this will continue
   * moving around even if gridMove is null
   * ??????????????????????????
   */
  if (gridMove != null && e.buttons === 4) handleMiddleMove();
  if (active != null) moveNode();
});

wrapper.addEventListener(`scroll`, (e) => {
  if (active == null) return;
  moveNode();
});

window.addEventListener(`mouseup`, () => {
  releaseNode();
  releaseMiddle();
});

window.addEventListener(`blur`, () => {
  releaseNode();
  releaseMiddle();
});

// left click functions

// TODO: this function seems to be very closely related to the one in contextMenu.
// maybe it can be extracted to a utility and abstracted? 
// especially the part where it goes up the node chain
function handleMouseL(): void {
  let elem: Node | null = document.elementFromPoint(mx, my);
  
  let titleSelected = false;
  let dataNode;

  while (elem?.parentNode != null && dataNode == null) { // "elem?.parentNode" could potentially go wrong.
    if (!isInterface<HTMLElement>(elem, `parentNode`)) {
      return;
    }
    if (elem.tagName.toLowerCase() === `input`) return;

    if (elem.classList.contains(`nodeTitle`)) titleSelected = true;

    if (elem.classList.contains(`node`)) {
      dataNode = elem;
    }

    elem = elem.parentNode as Node;
  }

  if (dataNode == null || !titleSelected) return;

  if (!grid) {
    throw new Error(`Node editor grid not found`);
  }
  const gridRect = grid.getBoundingClientRect();

  active = {
    node: dataNode,
    offsetX: dataNode.offsetLeft - (mx - gridRect.left),
    offsetY: dataNode.offsetTop - (my - gridRect.top)
  };

  dataNode.classList.add(`active`);

  edgeScroll = scrollStep;

  window.requestAnimationFrame(edgeScroll);
}

function moveNode(): void {
  if (!grid) {
    throw new Error(`Node editor grid not found`);
  }
  const gridRect = grid.getBoundingClientRect();

  if (!active) {
    throw new Error(`There doesn't appear to be any active node`);
  }

  const limitH = grid.offsetWidth - active.node.offsetWidth;
  const limitV = grid.offsetHeight - active.node.offsetHeight;

  active.node.style.left = Math.max(0, Math.min(limitH, ((mx - gridRect.left) + active.offsetX))) + `px`;
  active.node.style.top = Math.max(0, Math.min(limitV, ((my - gridRect.top) + active.offsetY))) + `px`;

  updateConnections();
}

function scrollStep(): void {
  if (!wrapper) {
    throw new Error(`Node editor wrapper not found`);
  }

  const box = wrapper.getBoundingClientRect();
  const cw = wrapper.clientWidth;
  const ch = wrapper.clientHeight;
  const limitH = wrapper.scrollWidth - wrapper.clientWidth;
  const limitV = wrapper.scrollHeight - wrapper.clientHeight;

  const areaMult = 0.2;
  const speedMult = 3.3;

  const aTop = box.top + (ch * areaMult);
  const aRight = box.right - (cw * areaMult);
  const aBottom = box.bottom - (ch * areaMult);
  const aLeft = box.left + (cw * areaMult);

  const up = Math.abs(Math.min(0, (my - aTop) / (ch * areaMult)));
  const right = Math.abs(Math.max(0, (mx - aRight) / (cw * areaMult)));
  const down = Math.abs(Math.max(0, (my - aBottom) / (ch * areaMult)));
  const left = Math.abs(Math.min(0, (mx - aLeft) / (cw * areaMult)));

  wrapper.scrollLeft = Math.min(limitH, wrapper.scrollLeft + ((right - left) * speedMult));
  wrapper.scrollTop = Math.min(limitV, wrapper.scrollTop + ((down - up) * speedMult));

  if (edgeScroll != null) window.requestAnimationFrame(edgeScroll);
}

function releaseNode(): void {
  if (active == null) return;

  active.node.classList.remove(`active`);
  active = null;
  if (edgeScroll != null) edgeScroll = null;
}

// middle click functions

function handleMiddle(): void {
  if (!wrapper) {
    throw new Error(`Node editor wrapper not found`);
  }

  wrapper.classList.add(`panning`);

  gridMove = {
    oldLeft: wrapper.scrollLeft,
    oldTop: wrapper.scrollTop,
    oldX: mx,
    oldY: my,
  };
}

function handleMiddleMove(): void {
  if (!wrapper) {
    throw new Error(`Node editor wrapper not found`);
  }
  if (!gridMove) {
    throw new Error(`FIXME: what is \`gridMove\`?`);
  }

  wrapper.scrollLeft = gridMove.oldLeft + (gridMove.oldX - mx);
  wrapper.scrollTop = gridMove.oldTop + (gridMove.oldY - my);
}

function releaseMiddle(): void {
  if (!wrapper) {
    throw new Error(`Node editor wrapper not found`);
  }

  wrapper.classList.remove(`panning`);
  gridMove = null;
}

// rendering functions

function updateConnections(): void {
  const canvas: HTMLCanvasElement | null = document.querySelector(`#nodeConnections`);
  if (!canvas) {
    throw new Error(`Element with ID #nodeConnections was not found`);
  }

  const ctx = canvas.getContext(`2d`);
  if (!ctx) {
    throw new Error(`Could not get context for #nodeConnections`);
  }

  ctx.canvas.width = canvas.offsetWidth;
  ctx.canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!grid) {
    throw new Error(`Node editor grid not found`);
  }

  for (const connection of connections) {
    const node0 = grid.querySelector(`#` + connection.node0.id);
    const node1 = grid.querySelector(`#` + connection.node1.id);

    const debug = {
      connection,
      node0,
      node1
    };

    if (node0 == null || node1 == null) {
      return console.error(`Failed to get nodes from grid`, debug);
    }

    const outputs = node0.querySelectorAll(`.nodeIO.output .nodePlug`);
    const inputs = node1.querySelectorAll(`.nodeIO.input .nodePlug`);

    const plug0 = outputs[connection.node0.plug];
    const plug1 = inputs[connection.node1.plug];

    if (plug0 == null || plug1 == null) {
      return console.error(`Failed to get node plugs`, debug);
    }

    const gbox = grid.getBoundingClientRect();
    const box0 = plug0.getBoundingClientRect();
    const box1 = plug1.getBoundingClientRect();

    const x0 = Math.abs(box0.left - gbox.left) + (box0.width / 2);
    const y0 = Math.abs(box0.top - gbox.top) + (box0.height / 2);
    const x1 = Math.abs(box1.left - gbox.left) + (box1.width / 2);
    const y1 = Math.abs(box1.top - gbox.top) + (box1.height / 2);

    const plug0Color = window.getComputedStyle(plug0, `:before`).backgroundColor;
    const plug1Color = window.getComputedStyle(plug1, `:before`).backgroundColor;

    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

    gradient.addColorStop(0, plug0Color);
    gradient.addColorStop(1, plug1Color);

    ctx.lineWidth = 4;
    ctx.lineCap = `round`;
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    // ctx.moveTo(0, 0);
    // ctx.lineTo(4096, 2048);
    ctx.stroke();
  }
}

updateConnections();