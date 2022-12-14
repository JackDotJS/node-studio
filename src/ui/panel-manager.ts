import memory from "../memory.js";
import isInterface from "../util/is-interface.js";

const container = document.getElementById(`editor-space`);

if (!container) {
  throw new Error(`#editor-space element not found`);
}

let target: Element | null = null;
let divSizeX = 0;
let divSizeY = 0;

container.addEventListener(`mousedown`, (e) => {
  e.preventDefault();
  if (e.button !== 0) return;

  let elem: Element | null = document.elementFromPoint(e.clientX, e.clientY);

  if (elem == null || elem.parentElement == null) return;

  const h = elem.parentElement.classList.contains(`resize-h`);
  const v = elem.parentElement.classList.contains(`resize-v`);

  // if both classes are present or both are missing, return
  if ((h && v) || (!h && !v)) return;

  const parentBox = elem.getBoundingClientRect();
  const divider = window.getComputedStyle(elem, `:after`);

  // checks if pseudo-element is even defined
  if ([divider.top, divider.left, divider.right, divider.bottom].includes(`auto`)) return;

  // check if cursor is selecting the pseudo-element

  const afterTop = parentBox.top + Math.abs(parseInt(divider.top));
  const afterLeft = parentBox.left + Math.abs(parseInt(divider.left));
  const afterRight = parentBox.right + Math.abs(parseInt(divider.right));
  const afterBottom = parentBox.bottom + Math.abs(parseInt(divider.bottom));

  const withinTop = e.clientY >= afterTop;
  const withinLeft = e.clientX >= afterLeft;
  const withinRight = e.clientX <= afterRight;
  const withinBottom = e.clientY <= afterBottom;

  if (!withinTop || !withinLeft || !withinRight || !withinBottom) return;

  divSizeX = Math.abs(afterLeft - afterRight);
  divSizeY = Math.abs(afterTop - afterBottom);

  console.log(`start resizing`)
  target = elem;
});

window.addEventListener(`mousemove`, (e) => {
  if (target == null || target.nextElementSibling == null) return;

  const sib = target.nextElementSibling;

  if (!isInterface<HTMLElement>(target, `offsetWidth`)) return;
  if (!isInterface<HTMLElement>(sib, `offsetWidth`)) return;
  if (!isInterface<HTMLElement>(target, `offsetHeight`)) return;
  if (!isInterface<HTMLElement>(sib, `offsetHeight`)) return;
  
  let divSize = Math.floor(divSizeX);
  let leftRect = target.getBoundingClientRect();
  let rightRect = sib.getBoundingClientRect();
  let sumSize = (leftRect.width + rightRect.width);
  let isLast = (sib.parentElement?.lastElementChild === sib);
  let endLimit = isLast ? sumSize : sumSize - divSize;

  if (target.parentElement?.classList.contains(`resize-v`)) {
    sumSize = (leftRect.height + rightRect.height);
    divSize = Math.floor(divSizeY);
    endLimit = isLast ? sumSize : sumSize - divSize;

    const clamped = Math.min(Math.max((e.clientY + (divSize / 2)) - leftRect.top, divSize), endLimit)

    target.style.flexGrow = `0`;
    target.style.minHeight = `${clamped}px`;
    target.style.maxHeight = `${clamped}px`;

    sib.style.flexGrow = `0`;
    sib.style.minHeight = `${sumSize - clamped}px`;
    sib.style.maxHeight = `${sumSize - clamped}px`;
  } else {
    const clamped = Math.min(Math.max((e.clientX + (divSize / 2)) - leftRect.left, divSize), endLimit)

    target.style.flexGrow = `0`;
    target.style.minWidth = `${clamped}px`;
    target.style.maxWidth = `${clamped}px`;

    sib.style.flexGrow = `0`;
    sib.style.minWidth = `${sumSize - clamped}px`;
    sib.style.maxWidth = `${sumSize - clamped}px`;
  }
});

const finish = () => {
  if (target == null) return;
  console.log(`stop resizing`)
  target = null;
}

window.addEventListener(`mouseup`, finish);
window.addEventListener(`blur`, finish);