const editor = document.querySelector(`#nodeEditor`);
const wrapper = editor.querySelector(`#ndGridWrapper`);
const grid = editor.querySelector(`#ndGrid`);

console.warn(`reminder: cursor changes dont work with the webdev console open!!!`)

let active = null;
let edgeScroll = null;
let mx = 0;
let my = 0;
let gridMove = null;

// center grid on startup
wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) / 2;

grid.addEventListener(`mousedown`, (e) => {
  e.preventDefault();

  mx = e.clientX;
  my = e.clientY;

  if (e.button === 1) handleMiddle();
  if (e.button === 0) handleMouseL();
});

window.addEventListener(`mousemove`, (e) => {
  mx = e.clientX;
  my = e.clientY;

  /**
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

function handleMouseL() {
  let elem = document.elementFromPoint(mx, my);

  let titleSelected = false;
  let dataNode;
  while (elem.parentNode != null && dataNode == null) {
    if (elem.tagName.toLowerCase() === `input`) return;

    if (elem.classList.contains(`nodeTitle`)) titleSelected = true;

    if (elem.classList.contains(`node`)) {
      dataNode = elem;
    }

    elem = elem.parentNode;
  }

  if (dataNode == null || !titleSelected) return;

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

function moveNode() {
  const gridRect = grid.getBoundingClientRect();

  const limitH = grid.offsetWidth - active.node.offsetWidth;
  const limitV = grid.offsetHeight - active.node.offsetHeight;

  active.node.style.left = Math.max(0, Math.min(limitH, ((mx - gridRect.left) + active.offsetX))) + `px`;
  active.node.style.top = Math.max(0, Math.min(limitV, ((my - gridRect.top) + active.offsetY))) + `px`;
}

function scrollStep()  {
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

function releaseNode() {
  if (active == null) return;
  
  active.node.classList.remove(`active`);
  active = null;
  if (edgeScroll != null) edgeScroll = null;
}

// middle click functions

function handleMiddle() {
  wrapper.classList.add(`panning`);

  gridMove = {
    oldLeft: wrapper.scrollLeft,
    oldTop: wrapper.scrollTop,
    oldX: mx,
    oldY: my,
  };
}

function handleMiddleMove() {
  wrapper.scrollLeft = gridMove.oldLeft + (gridMove.oldX - mx);
  wrapper.scrollTop = gridMove.oldTop + (gridMove.oldY - my);
}

function releaseMiddle() {
  wrapper.classList.remove(`panning`);
  gridMove == null;
}