const editor = document.querySelector(`#nodeEditor`);
const grid = editor.querySelector(`#ndGrid`);

function centerEditor() {
  const wrapper = editor.querySelector(`#ndGridWrapper`);
  wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;

  wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) / 2;
}

centerEditor();

let active = null;

grid.addEventListener(`mousedown`, (e) => {
  if (e.button !== 0) return;

  e.preventDefault();

  const x = e.clientX;
  const y = e.clientY;

  let elem = document.elementFromPoint(x, y);

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
    offsetX: dataNode.offsetLeft - (x - gridRect.left),
    offsetY: dataNode.offsetTop - (y - gridRect.top)
  };

  dataNode.classList.add(`active`);
});

window.addEventListener(`mousemove`, (e) => {
  if (active == null) return;

  const x = e.clientX;
  const y = e.clientY;
  const gridRect = grid.getBoundingClientRect();

  active.node.style.left = ((x - gridRect.left) + active.offsetX) + `px`;
  active.node.style.top = ((y - gridRect.top) + active.offsetY) + `px`;
});

window.addEventListener(`mouseup`, (e) => {
  if (active == null) return;
  active.node.classList.remove(`active`);
  active = null;
});

window.addEventListener(`blur`, (e) => {
  if (active == null) return;
  active.node.classList.remove(`active`);
  active = null;
});